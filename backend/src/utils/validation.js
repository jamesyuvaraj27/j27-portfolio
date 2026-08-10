export const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const sanitizeUrl = (value) => {
  const url = sanitizeString(value);
  if (!url) return "";

  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
};

export const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeString(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
};

export const parseNumber = (value, { min, max, fallback } = {}) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    if (fallback !== undefined) return fallback;
    const error = new Error("Expected a valid number.");
    error.statusCode = 400;
    throw error;
  }
  let result = num;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
};

export const normalizeDate = (value, label) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error(`${label} must be a valid date.`);
    error.statusCode = 400;
    throw error;
  }
  return date;
};

export const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};
