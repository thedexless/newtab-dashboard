// Pure coordinate parsing helpers. Blank or non-finite trimmed text maps to
// undefined so the parent treats the field as empty instead of zero.

const parseNumber = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
};

export const parseLatitude = (raw: string): number | undefined => {
  const lat = parseNumber(raw);
  if (lat == null) return undefined;
  return lat >= -90 && lat <= 90 ? lat : undefined;
};

export const parseLongitude = (raw: string): number | undefined => {
  const long = parseNumber(raw);
  if (long == null) return undefined;
  return long >= -180 && long <= 180 ? long : undefined;
};
