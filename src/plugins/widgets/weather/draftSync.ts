// Decides whether a prop-driven sync should overwrite the local draft string.
// Returns the new draft when the prop is a genuine coordinate, or null to
// leave the current draft untouched. This preserves intermediate edits such
// as "-" (which parse to undefined) so they can be completed as negatives.
export const draftFromProp = (
  prop: number | undefined,
  isValid: (n?: number) => boolean
): string | null => {
  if (isValid(prop)) return String(prop);
  return null;
};
