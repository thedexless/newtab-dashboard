import { draftFromProp } from "./draftSync";

const isLat = (n?: number) => n != null && n >= -90 && n <= 90;
const isLong = (n?: number) => n != null && n >= -180 && n <= 180;

describe("weather/draftSync", () => {
  describe("latitude draft preservation", () => {
    it("does not clobber the draft when the prop is undefined", () => {
      expect(draftFromProp(undefined, isLat)).toBeNull();
    });

    it("preserves intermediate edits like '-' (prop undefined)", () => {
      expect(draftFromProp(undefined, isLat)).toBeNull();
    });

    it("refreshes the draft on a genuine external coordinate", () => {
      expect(draftFromProp(-33.8688, isLat)).toBe("-33.8688");
      expect(draftFromProp(45.5, isLat)).toBe("45.5");
    });

    it("returns null for out-of-range props", () => {
      expect(draftFromProp(91, isLat)).toBeNull();
      expect(draftFromProp(-91, isLat)).toBeNull();
    });
  });

  describe("longitude draft preservation", () => {
    it("does not clobber the draft when the prop is undefined", () => {
      expect(draftFromProp(undefined, isLong)).toBeNull();
    });

    it("preserves intermediate edits like '-' (prop undefined)", () => {
      expect(draftFromProp(undefined, isLong)).toBeNull();
    });

    it("refreshes the draft on a genuine external coordinate", () => {
      expect(draftFromProp(151.2093, isLong)).toBe("151.2093");
      expect(draftFromProp(-0.1276, isLong)).toBe("-0.1276");
    });

    it("returns null for out-of-range props", () => {
      expect(draftFromProp(181, isLong)).toBeNull();
      expect(draftFromProp(-181, isLong)).toBeNull();
    });
  });

  it("preserves the draft across the full negative-entry sequence", () => {
    // typing "-", then "-3", then "-33" for latitude
    expect(draftFromProp(undefined, isLat)).toBeNull();
    expect(draftFromProp(-3, isLat)).toBe("-3");
    expect(draftFromProp(-33, isLat)).toBe("-33");
  });
});
