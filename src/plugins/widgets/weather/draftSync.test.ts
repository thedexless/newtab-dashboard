import { draftFromProp } from "./draftSync";
import { parseLatitude, parseLongitude } from "./coordinates";

const isLat = (n?: number) => n != null && n >= -90 && n <= 90;
const isLong = (n?: number) => n != null && n >= -180 && n <= 180;

describe("weather/draftSync", () => {
  describe("latitude draft preservation", () => {
    it("does not clobber the draft when the prop is undefined", () => {
      expect(draftFromProp(undefined, isLat, "-", parseLatitude)).toBeNull();
      expect(draftFromProp(undefined, isLat, "1.", parseLatitude)).toBeNull();
    });

    it("preserves intermediate edits like '-' (prop undefined)", () => {
      expect(draftFromProp(undefined, isLat, "-", parseLatitude)).toBeNull();
    });

    it("refreshes the draft on a genuine external coordinate", () => {
      expect(draftFromProp(-33.8688, isLat, "0", parseLatitude)).toBe("-33.8688");
      expect(draftFromProp(45.5, isLat, "0", parseLatitude)).toBe("45.5");
    });

    it("returns null for out-of-range props", () => {
      expect(draftFromProp(91, isLat, "0", parseLatitude)).toBeNull();
      expect(draftFromProp(-91, isLat, "0", parseLatitude)).toBeNull();
    });

    it("preserves a valid-but-incomplete draft like '1.' when the prop reflects 1", () => {
      // The user typed "1." which parses to 1; the parent prop becomes 1.
      // The draft must not be normalized to "1" mid-edit.
      expect(draftFromProp(1, isLat, "1.", parseLatitude)).toBeNull();
      expect(draftFromProp(0, isLat, "0.", parseLatitude)).toBeNull();
      expect(draftFromProp(45, isLat, "45.", parseLatitude)).toBeNull();
    });

    it("replaces the draft when the prop differs from the locally parsed draft", () => {
      // Genuine external change: draft "1." (parses 1) vs prop 5 -> refresh.
      expect(draftFromProp(5, isLat, "1.", parseLatitude)).toBe("5");
      expect(draftFromProp(12, isLat, "1.", parseLatitude)).toBe("12");
    });
  });

  describe("longitude draft preservation", () => {
    it("does not clobber the draft when the prop is undefined", () => {
      expect(draftFromProp(undefined, isLong, "-", parseLongitude)).toBeNull();
      expect(draftFromProp(undefined, isLong, "1.", parseLongitude)).toBeNull();
    });

    it("preserves intermediate edits like '-' (prop undefined)", () => {
      expect(draftFromProp(undefined, isLong, "-", parseLongitude)).toBeNull();
    });

    it("refreshes the draft on a genuine external coordinate", () => {
      expect(draftFromProp(151.2093, isLong, "0", parseLongitude)).toBe("151.2093");
      expect(draftFromProp(-0.1276, isLong, "0", parseLongitude)).toBe("-0.1276");
    });

    it("returns null for out-of-range props", () => {
      expect(draftFromProp(181, isLong, "0", parseLongitude)).toBeNull();
      expect(draftFromProp(-181, isLong, "0", parseLongitude)).toBeNull();
    });

    it("preserves a valid-but-incomplete draft like '1.' when the prop reflects 1", () => {
      expect(draftFromProp(1, isLong, "1.", parseLongitude)).toBeNull();
      expect(draftFromProp(0, isLong, "0.", parseLongitude)).toBeNull();
      expect(draftFromProp(151, isLong, "151.", parseLongitude)).toBeNull();
    });

    it("replaces the draft when the prop differs from the locally parsed draft", () => {
      expect(draftFromProp(5, isLong, "1.", parseLongitude)).toBe("5");
      expect(draftFromProp(200, isLong, "1.", parseLongitude)).toBeNull();
    });
  });

  it("preserves the draft across the full negative-entry sequence", () => {
    // typing "-", then "-3", then "-33" for latitude
    expect(draftFromProp(undefined, isLat, "-", parseLatitude)).toBeNull();
    expect(draftFromProp(-3, isLat, "-3", parseLatitude)).toBeNull();
    expect(draftFromProp(-33, isLat, "-33", parseLatitude)).toBeNull();
  });

  it("preserves trailing decimals for both coordinates mid-edit", () => {
    // Latitude "45." (prop 45) and longitude "151." (prop 151) stay intact.
    expect(draftFromProp(45, isLat, "45.", parseLatitude)).toBeNull();
    expect(draftFromProp(151, isLong, "151.", parseLongitude)).toBeNull();
  });
});
