const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const MAX_LABEL_LENGTH = 50;
const MAX_NAME_RETRIES = 5;
const MAX_OSF_PAGES = 100;

const M1_COUNT = 12;
const M2_COUNT = 24;
const M3_COUNT = 15;
const PHQ4_COUNT = 4;

const M2_REVERSE_ITEMS = new Set([1, 6, 8, 12, 17, 19, 24]);
const M3_REVERSE_ITEMS = new Set([1, 3, 7, 8, 10, 14]);

const CSV_HEADERS = [
  "schema_version",
  "respondent_id",
  "file_label",
  "file_seq",
  "user_label",
  "submitted_at",
  "gender",
  "age",
  "dx",
  ...Array.from({ length: PHQ4_COUNT }, (_, i) => `phq4_${i + 1}_raw`),
  ...Array.from({ length: M1_COUNT }, (_, i) => `opd_${i + 1}_raw`),
  ...Array.from({ length: M2_COUNT }, (_, i) => `sifs_${i + 1}_raw`),
  ...Array.from({ length: M2_COUNT }, (_, i) => `sifs_${i + 1}_keyed`),
  ...Array.from({ length: M3_COUNT }, (_, i) => `bfi_${i + 1}_raw`),
  ...Array.from({ length: M3_COUNT }, (_, i) => `bfi_${i + 1}_keyed`),
  "phq4_anxiety_sum",
  "phq4_depression_sum",
  "phq4_total_sum",
  "opd_total_sum",
  "opd_self_perception_sum",
  "opd_contact_sum",
  "opd_relationship_model_sum",
  "sifs_total_mean",
  "sifs_identity_mean",
  "sifs_self_direction_mean",
  "sifs_empathy_mean",
  "sifs_intimacy_mean",
  "bfi_extraversion_mean",
  "bfi_agreeableness_mean",
  "bfi_conscientiousness_mean",
  "bfi_negative_emotionality_mean",
  "bfi_openness_mean",
  "phq4_missing",
  "opd_missing",
  "sifs_missing",
  "bfi_missing",
];

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
  });
}

function getEnvOrThrow(env, key, fallbackKey) {
  const value = (env[key] || (fallbackKey ? env[fallbackKey] : "") || "").trim();
  if (!value) {
    throw new HttpError(500, `Missing required environment variable: ${key}`);
  }
  return value;
}

function getAuthHeaders(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function fetchOsf(url, token, init = {}, context = "OSF request") {
  let response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        ...getAuthHeaders(token),
        ...(init.headers || {}),
      },
    });
  } catch (err) {
    throw new HttpError(502, `${context} network error`, {
      url,
      message: String(err),
    });
  }

  const raw = await response.text();
  const parsed = safeJsonParse(raw);

  if (!response.ok) {
    throw new HttpError(response.status, `${context} failed`, {
      url,
      status: response.status,
      statusText: response.statusText,
      osfErrors: parsed?.errors || null,
      bodySnippet: raw.slice(0, 500),
    });
  }

  if (!parsed || typeof parsed !== "object") {
    throw new HttpError(502, `${context} returned non-JSON`, {
      url,
      bodySnippet: raw.slice(0, 500),
    });
  }

  return parsed;
}

function asResourceList(jsonData) {
  if (!jsonData || typeof jsonData !== "object") return [];
  const { data } = jsonData;
  if (Array.isArray(data)) return data.filter(Boolean);
  if (data && typeof data === "object") return [data];
  return [];
}

function getChildrenHref(resource) {
  return (
    resource?.relationships?.files?.links?.related?.href ||
    resource?.relationships?.children?.links?.related?.href ||
    null
  );
}

function getUploadLink(resource) {
  return resource?.links?.upload || null;
}

function getResourceKind(resource) {
  return resource?.attributes?.kind || resource?.kind || null;
}

function getResourceName(resource) {
  return resource?.attributes?.name || resource?.name || null;
}

function appendQuery(url, params) {
  const u = new URL(url);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      u.searchParams.set(k, String(v));
    }
  });
  return u.toString();
}

function sanitizeLabel(input) {
  let value = typeof input === "string" ? input : "";
  if (value.normalize) {
    value = value.normalize("NFKC");
  }

  value = value.trim();
  value = value.replace(/[\s\t]+/g, "_");
  value = value.replace(/[\\/:*?"<>|]/g, "");
  value = value.replace(/[\x00-\x1F\x7F]/g, "");
  value = value.replace(/[^A-Za-z0-9А-Яа-яЁё._-]/g, "");
  value = value.replace(/_+/g, "_");
  value = value.replace(/^[._-]+|[._-]+$/g, "");

  if (value.length > MAX_LABEL_LENGTH) {
    value = value.slice(0, MAX_LABEL_LENGTH).replace(/[._-]+$/g, "");
  }

  return value || "anon";
}

async function resolveProviderRoot(nodeId, provider, token) {
  const providerRootUrl = `https://api.osf.io/v2/nodes/${encodeURIComponent(nodeId)}/files/${encodeURIComponent(provider)}/`;
  const rootJson = await fetchOsf(providerRootUrl, token, {}, "OSF provider root lookup");

  const resources = asResourceList(rootJson);
  const directRoot = resources.find((r) => getUploadLink(r) && getChildrenHref(r)) || resources[0];

  if (!directRoot) {
    throw new HttpError(502, "OSF provider root lookup returned empty data", {
      url: providerRootUrl,
    });
  }

  const uploadUrl = getUploadLink(directRoot);
  const childrenHref = getChildrenHref(directRoot);

  if (!uploadUrl || !childrenHref) {
    throw new HttpError(502, "OSF provider root is missing required links", {
      url: providerRootUrl,
      hasUploadLink: Boolean(uploadUrl),
      hasChildrenHref: Boolean(childrenHref),
      resourceName: getResourceName(directRoot),
      resourceKind: getResourceKind(directRoot),
    });
  }

  return {
    uploadUrl,
    childrenHref,
    name: getResourceName(directRoot) || provider,
  };
}

async function listAllChildren(childrenHref, token, context = "OSF children list") {
  let nextUrl = childrenHref;
  let page = 0;
  const out = [];

  while (nextUrl) {
    page += 1;
    if (page > MAX_OSF_PAGES) {
      throw new HttpError(502, `${context} exceeded pagination limit`, {
        startUrl: childrenHref,
        maxPages: MAX_OSF_PAGES,
      });
    }

    const jsonData = await fetchOsf(nextUrl, token, {}, `${context} (page ${page})`);
    out.push(...asResourceList(jsonData));
    nextUrl = jsonData?.links?.next || null;
  }

  return out;
}

async function ensureFolder(parentRef, folderName, token) {
  const findFolder = async () => {
    const children = await listAllChildren(parentRef.childrenHref, token, `List children of ${parentRef.name}`);
    return (
      children.find(
        (item) =>
          getResourceKind(item) === "folder" &&
          String(getResourceName(item) || "").trim() === folderName
      ) || null
    );
  };

  let folder = await findFolder();

  if (!folder) {
    const createUrl = appendQuery(parentRef.uploadUrl, { kind: "folder", name: folderName });

    try {
      await fetchOsf(
        createUrl,
        token,
        { method: "PUT" },
        `Create folder "${folderName}" inside "${parentRef.name}"`
      );
    } catch (err) {
      if (!(err instanceof HttpError) || err.status !== 409) {
        throw err;
      }
    }

    folder = await findFolder();
  }

  if (!folder) {
    throw new HttpError(502, `Folder "${folderName}" not found after ensure`, {
      parent: parentRef.name,
      childrenHref: parentRef.childrenHref,
    });
  }

  const uploadUrl = getUploadLink(folder);
  const childrenHref = getChildrenHref(folder);
  if (!uploadUrl || !childrenHref) {
    throw new HttpError(502, `Folder "${folderName}" is missing links.upload or children related href`, {
      folderName,
      hasUploadLink: Boolean(uploadUrl),
      hasChildrenHref: Boolean(childrenHref),
    });
  }

  return {
    uploadUrl,
    childrenHref,
    name: folderName,
  };
}

async function uploadFile(folderRef, fileName, body, token, contentType) {
  const uploadUrl = appendQuery(folderRef.uploadUrl, { kind: "file", name: fileName });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: getAuthHeaders(token, {
      "Content-Type": contentType || "text/plain; charset=utf-8",
    }),
    body,
  });

  if (response.status === 409) {
    return { conflict: true };
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    const parsed = safeJsonParse(raw);
    throw new HttpError(response.status, `OSF upload failed for ${folderRef.name}/${fileName}`, {
      url: uploadUrl,
      status: response.status,
      statusText: response.statusText,
      osfErrors: parsed?.errors || null,
      bodySnippet: raw.slice(0, 500),
    });
  }

  return { conflict: false };
}

function makeFileBase(safeLabel, respondentId, seed = 0) {
  const ts = Date.now();
  const compactId = String(respondentId || "")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(-12) || "anon";
  const suffix = seed > 0 ? `_${seed}` : "";
  return {
    baseName: `${safeLabel}_${ts}_${compactId}${suffix}`,
    seq: ts,
  };
}

function parseNumberSafe(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(num)) return null;
  return num;
}

function parseLikert(value, min, max) {
  const num = parseNumberSafe(value);
  if (num === null || !Number.isInteger(num)) return null;
  if (num < min || num > max) return null;
  return num;
}

function sumIgnoringMissing(values) {
  const valid = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!valid.length) return null;
  return valid.reduce((acc, v) => acc + v, 0);
}

function meanIgnoringMissing(values) {
  const valid = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!valid.length) return null;
  return valid.reduce((acc, v) => acc + v, 0) / valid.length;
}

function round4(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return Number(value.toFixed(4));
}

function normalizePayload(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  return {
    ...source,
    schema_version: source.schema_version || "2.0",
    respondent_id: source.respondent_id || "",
    user_label: typeof source.user_label === "string" ? source.user_label.trim() : "",
    submitted_at: source.submitted_at || "",
    demographics: source.demographics && typeof source.demographics === "object" ? source.demographics : {},
    responses: source.responses && typeof source.responses === "object" ? source.responses : {},
  };
}

function collectRawScale(scaleObj, prefix, count, min, max) {
  const values = {};
  let missing = 0;

  for (let i = 1; i <= count; i++) {
    const key = `${prefix}_${i}`;
    const parsed = parseLikert(scaleObj?.[key], min, max);
    values[i] = parsed;
    if (parsed === null) missing += 1;
  }

  return { values, missing };
}

function scoreRow(payload, fileLabel, fileSeq) {
  const demographics = payload.demographics || {};
  const responses = payload.responses || {};

  const phq4 = collectRawScale(responses.phq4 || {}, "phq4", PHQ4_COUNT, 0, 3);
  const m1 = collectRawScale(responses.m1 || {}, "m1", M1_COUNT, 0, 4);
  const m2 = collectRawScale(responses.m2 || {}, "m2", M2_COUNT, 0, 4);
  const m3 = collectRawScale(responses.m3 || {}, "m3", M3_COUNT, 1, 5);

  const m2Scored = {};
  for (let i = 1; i <= M2_COUNT; i++) {
    const raw = m2.values[i];
    if (raw === null) {
      m2Scored[i] = null;
    } else {
      m2Scored[i] = M2_REVERSE_ITEMS.has(i) ? 4 - raw : raw;
    }
  }

  const m3Scored = {};
  for (let i = 1; i <= M3_COUNT; i++) {
    const raw = m3.values[i];
    if (raw === null) {
      m3Scored[i] = null;
    } else {
      m3Scored[i] = M3_REVERSE_ITEMS.has(i) ? 6 - raw : raw;
    }
  }

  const takeSum = (valuesMap, indices) => sumIgnoringMissing(indices.map((i) => valuesMap[i]));
  const takeMean = (valuesMap, indices) => meanIgnoringMissing(indices.map((i) => valuesMap[i]));

  const row = {
    schema_version: payload.schema_version || "2.0",
    respondent_id: payload.respondent_id || "",
    file_label: fileLabel,
    file_seq: fileSeq,
    user_label: payload.user_label || "",
    submitted_at: payload.submitted_at || "",
    gender: demographics.gender === "male" ? 0 : demographics.gender === "female" ? 1 : "",
    age: demographics.age ?? "",
    dx: demographics.dx === "yes" ? 1 : demographics.dx === "no" ? 0 : "",

    phq4_anxiety_sum: takeSum(phq4.values, [1, 2]),
    phq4_depression_sum: takeSum(phq4.values, [3, 4]),
    phq4_total_sum: takeSum(phq4.values, [1, 2, 3, 4]),

    opd_total_sum: takeSum(m1.values, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    opd_self_perception_sum: takeSum(m1.values, [1, 2, 5, 8]),
    opd_contact_sum: takeSum(m1.values, [4, 6, 10, 11]),
    opd_relationship_model_sum: takeSum(m1.values, [3, 7, 9, 12]),

    sifs_total_mean: round4(takeMean(m2Scored, Array.from({ length: M2_COUNT }, (_, i) => i + 1))),
    sifs_identity_mean: round4(takeMean(m2Scored, [1, 2, 3, 4, 5, 6, 7])),
    sifs_self_direction_mean: round4(takeMean(m2Scored, [8, 9, 10, 11, 12])),
    sifs_empathy_mean: round4(takeMean(m2Scored, [13, 14, 15, 16, 17, 18])),
    sifs_intimacy_mean: round4(takeMean(m2Scored, [19, 20, 21, 22, 23, 24])),

    bfi_extraversion_mean: round4(takeMean(m3Scored, [1, 6, 11])),
    bfi_agreeableness_mean: round4(takeMean(m3Scored, [2, 7, 12])),
    bfi_conscientiousness_mean: round4(takeMean(m3Scored, [3, 8, 13])),
    bfi_negative_emotionality_mean: round4(takeMean(m3Scored, [4, 9, 14])),
    bfi_openness_mean: round4(takeMean(m3Scored, [5, 10, 15])),

    phq4_missing: phq4.missing,
    opd_missing: m1.missing,
    sifs_missing: m2.missing,
    bfi_missing: m3.missing,
  };

  for (let i = 1; i <= PHQ4_COUNT; i++) row[`phq4_${i}_raw`] = phq4.values[i];
  for (let i = 1; i <= M1_COUNT; i++) row[`opd_${i}_raw`] = m1.values[i];
  for (let i = 1; i <= M2_COUNT; i++) {
    row[`sifs_${i}_raw`] = m2.values[i];
    row[`sifs_${i}_keyed`] = m2Scored[i];
  }
  for (let i = 1; i <= M3_COUNT; i++) {
    row[`bfi_${i}_raw`] = m3.values[i];
    row[`bfi_${i}_keyed`] = m3Scored[i];
  }

  return row;
}

function csvEscape(value, delimiter) {
  const str = value == null ? "" : String(value);
  if (str.includes("\"") || str.includes("\n") || str.includes("\r") || str.includes(delimiter)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildAllRowsCsv(row) {
  const delimiter = ";";
  const headerLine = CSV_HEADERS.map((h) => csvEscape(h, delimiter)).join(delimiter);
  const rowLine = CSV_HEADERS.map((h) => csvEscape(row[h], delimiter)).join(delimiter);
  return `\uFEFFsep=${delimiter}\r\n${headerLine}\r\n${rowLine}\r\n`;
}

function ensureRequestPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request JSON must be an object");
  }

  if (!body.respondent_id || typeof body.respondent_id !== "string") {
    throw new HttpError(400, "Missing or invalid respondent_id");
  }

  if (!body.responses || typeof body.responses !== "object") {
    throw new HttpError(400, "Missing responses object");
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname !== "/submit") {
      return json({ ok: false, error: "Not Found" }, 404);
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method Not Allowed" }, 405);
    }

    try {
      const token = getEnvOrThrow(env, "OSF_PAT", "OSF_TOKEN");
      const nodeId = getEnvOrThrow(env, "OSF_NODE_ID");
      const provider = (env.OSF_PROVIDER || "osfstorage").trim();
      const baseFolderName = (env.OSF_FOLDER || "responses").trim();

      let parsedBody;
      try {
        parsedBody = await request.json();
      } catch {
        throw new HttpError(400, "Invalid JSON in request body");
      }

      ensureRequestPayload(parsedBody);
      const payload = normalizePayload(parsedBody);
      const safeLabel = sanitizeLabel(payload.user_label);

      const root = await resolveProviderRoot(nodeId, provider, token);
      const base = await ensureFolder(root, baseFolderName, token);
      const rawFolder = await ensureFolder(base, "raw", token);
      const allRowsFolder = await ensureFolder(base, "all_rows", token);

      const rawBody = `${JSON.stringify(parsedBody, null, 2)}\n`;

      let chosenSeq = null;
      let fileBase = null;

      for (let attempt = 0; attempt < MAX_NAME_RETRIES; attempt++) {
        const { baseName, seq } = makeFileBase(safeLabel, payload.respondent_id, attempt);

        const rawUpload = await uploadFile(
          rawFolder,
          `${baseName}.json`,
          rawBody,
          token,
          "application/json; charset=utf-8"
        );

        if (rawUpload.conflict) {
          continue;
        }

        const scoredRow = scoreRow(payload, safeLabel, seq);
        const csvBody = buildAllRowsCsv(scoredRow);

        const csvUpload = await uploadFile(
          allRowsFolder,
          `${baseName}.csv`,
          csvBody,
          token,
          "text/csv; charset=utf-8"
        );

        if (csvUpload.conflict) {
          throw new HttpError(500, "CSV name conflict after reserving RAW name", {
            baseName,
            seq,
            folder: "all_rows",
          });
        }

        chosenSeq = seq;
        fileBase = baseName;
        break;
      }

      if (!fileBase) {
        throw new HttpError(500, "Could not reserve unique file name", {
          maxAttempts: MAX_NAME_RETRIES,
        });
      }

      return json(
        {
          ok: true,
          file_csv: `${fileBase}.csv`,
          file_json: `${fileBase}.json`,
          seq: chosenSeq,
        },
        200
      );
    } catch (err) {
      if (err instanceof HttpError) {
        return json(
          {
            ok: false,
            error: err.message,
            details: err.details || undefined,
          },
          err.status
        );
      }

      return json(
        {
          ok: false,
          error: "Unexpected server error",
          details: String(err),
        },
        500
      );
    }
  },
};
