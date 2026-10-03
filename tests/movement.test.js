import { describe, expect, it } from "vitest";
import { MapModel } from "../src/map/Map.js";

describe("MapModel", () => {
  it("blocks walls and allows floor", () => {
    const map = new MapModel({ width: 2, height: 1, tiles: [0, 1] });
    expect(map.canEnter(0, 0)).toBe(true);
    expect(map.canEnter(1, 0)).toBe(false);
  });
});
