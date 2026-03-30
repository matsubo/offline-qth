import { describe, expect, it } from "vitest";
import {
  bearingToCardinal,
  calculateBearing,
  calculateGridLocator,
  convertToDMS,
  getCallArea,
  haversineDistance,
} from "./coordinate";

describe("convertToDMS", () => {
  it("converts positive latitude", () => {
    expect(convertToDMS(35.6895, true)).toBe(`35°41'22.20" N`);
  });

  it("converts negative latitude", () => {
    expect(convertToDMS(-33.8688, true)).toBe(`33°52'7.68" S`);
  });

  it("converts positive longitude", () => {
    expect(convertToDMS(139.6917, false)).toBe(`139°41'30.12" E`);
  });

  it("converts negative longitude", () => {
    expect(convertToDMS(-118.2437, false)).toBe(`118°14'37.32" W`);
  });
});

describe("calculateGridLocator", () => {
  it("calculates grid locator for Tokyo", () => {
    expect(calculateGridLocator(35.6895, 139.6917)).toBe("PM95uq");
  });

  it("calculates grid locator for London", () => {
    expect(calculateGridLocator(51.5074, -0.1278)).toBe("IO91wm");
  });
});

describe("haversineDistance", () => {
  it("returns 0 for same point", () => {
    expect(haversineDistance(35.6895, 139.6917, 35.6895, 139.6917)).toBe(0);
  });

  it("calculates distance between Tokyo and Osaka (~400km)", () => {
    const distance = haversineDistance(35.6895, 139.6917, 34.6937, 135.5023);
    expect(distance).toBeGreaterThan(390000);
    expect(distance).toBeLessThan(410000);
  });
});

describe("calculateBearing", () => {
  it("returns ~0 for due north", () => {
    const bearing = calculateBearing(35.0, 139.0, 36.0, 139.0);
    expect(bearing).toBeCloseTo(0, 0);
  });

  it("returns ~90 for due east", () => {
    const bearing = calculateBearing(35.0, 139.0, 35.0, 140.0);
    expect(bearing).toBeCloseTo(90, 0);
  });
});

describe("bearingToCardinal", () => {
  it("returns N for 0 degrees", () => {
    expect(bearingToCardinal(0)).toBe("N");
  });

  it("returns E for 90 degrees", () => {
    expect(bearingToCardinal(90)).toBe("E");
  });

  it("returns S for 180 degrees", () => {
    expect(bearingToCardinal(180)).toBe("S");
  });

  it("returns W for 270 degrees", () => {
    expect(bearingToCardinal(270)).toBe("W");
  });

  it("returns NE for 45 degrees", () => {
    expect(bearingToCardinal(45)).toBe("NE");
  });
});

describe("getCallArea", () => {
  it("returns 1 for Tokyo", () => {
    expect(getCallArea("東京都")).toBe(1);
  });

  it("returns 3 for Osaka", () => {
    expect(getCallArea("大阪府")).toBe(3);
  });

  it("returns 8 for Hokkaido", () => {
    expect(getCallArea("北海道")).toBe(8);
  });

  it("returns 0 for Okinawa", () => {
    expect(getCallArea("沖縄県")).toBe(0);
  });

  it("returns null for unknown prefecture", () => {
    expect(getCallArea("unknown")).toBeNull();
  });
});
