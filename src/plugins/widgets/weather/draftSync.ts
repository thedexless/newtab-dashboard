// Decides whether a prop-driven sync should overwrite the local draft string.
// Returns the new draft when the prop is a genuine external coordinate that
// differs from what the current draft already parses to, or null to leave the
// current draft untouched. This preserves intermediate edits such as "-"
// (which parse to undefined) and valid-but-incomplete drafts such as "1."
// (which parses to 1) so trailing decimals and partial negatives are not
// clobbered when the parent prop reflects the same parsed value.
export const draftFromProp = (
  prop: number | undefined,
  isValid: (n?: number) => boolean,
  currentDraft: string,
  parse: (raw: string) => number | undefined
): string | null => {
  if (!isValid(prop)) return null;
  if (parse(currentDraft) === prop) return null;
  return String(prop);
};
