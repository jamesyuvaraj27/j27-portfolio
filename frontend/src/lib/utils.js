export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinList = (value) => (Array.isArray(value) ? value.join(", ") : "");

// Cloudinary URLs (or any absolute URL) pass through untouched — there's no
// "/uploads/..." relative-path case anymore since everything lives on Cloudinary.
export function mediaUrl(value) {
  if (!value) return "";
  return value;
}

export function formatDate(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatMonthYear(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
