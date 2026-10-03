import { describe, expect, it } from "vitest";
import { MapModel } from "../src/map/Map.js";
import { hasLineOfSight } from "../src/map/LineOfSight.js";

describe("Line of sight", () => {
  it("is blocked by a wall", () => {
    const map = new MapModel({ width: 3, height: 1, tiles: [0,1,0] });
    expect(hasLineOfSight(map, {x:0,y:0}, {x:2,y:0})).toBe(false);
  });

  it("works through open tiles", () => {
    const map = new MapModel({ width: 3, height: 1, tiles: [0,0,0] });
    expect(hasLineOfSight(map, {x:0,y:0}, {x:2,y:0})).toBe(true);
  });
});
