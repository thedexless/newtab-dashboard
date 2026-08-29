import { parseLatitude, parseLongitude } from "./coordinates";

describe("weather/coordinates", () => {
  describe("parseLatitude", () => {
    it("returns undefined for blank input", () => {
      expect(parseLatitude("")).toBeUndefined();
      expect(parseLatitude("   ")).toBeUndefined();
    });

    it("returns undefined for non-numeric input", () => {
      expect(parseLatitude("-")).toBeUndefined();
      expect(parseLatitude("abc")).toBeUndefined();
    });

    it("returns undefined when out of range", () => {
      expect(parseLatitude("91")).toBeUndefined();
      expect(parseLatitude("-91")).toBeUndefined();
    });

    it("parses valid latitudes including negatives", () => {
      expect(parseLatitude("0")).toBe(0);
      expect(parseLatitude("90")).toBe(90);
      expect(parseLatitude("-90")).toBe(-90);
      expect(parseLatitude("45.5")).toBe(45.5);
      expect(parseLatitude(" -33.8688 ")).toBe(-33.8688);
    });
  });

  describe("parseLongitude", () => {
    it("returns undefined for blank input", () => {
      expect(parseLongitude("")).toBeUndefined();
      expect(parseLongitude("  ")).toBeUndefined();
    });

    it("returns undefined for non-numeric input", () => {
      expect(parseLongitude("--")).toBeUndefined();
    });

    it("returns undefined when out of range", () => {
      expect(parseLongitude("181")).toBeUndefined();
      expect(parseLongitude("-181")).toBeUndefined();
    });

    it("parses valid longitudes including negatives", () => {
      expect(parseLongitude("0")).toBe(0);
      expect(parseLongitude("180")).toBe(180);
      expect(parseLongitude("-180")).toBe(-180);
      expect(parseLongitude("151.2093")).toBe(151.2093);
      expect(parseLongitude(" -0.1276 ")).toBe(-0.1276);
    });
  });

  // Coverage for clearing populated fields: blank after a valid value
  // must yield undefined, not the previous number.
  it("clearing a populated latitude yields undefined", () => {
    expect(parseLatitude("45.5")).toBe(45.5);
    expect(parseLatitude("")).toBeUndefined();
  });

  it("clearing a populated longitude yields undefined", () => {
    expect(parseLongitude("151")).toBe(151);
    expect(parseLongitude("")).toBeUndefined();
  });
});
