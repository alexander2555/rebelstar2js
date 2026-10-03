import { describe, expect, it } from "vitest";
import { Random } from "../src/utils/Random.js";

describe("deterministic RNG", () => {
  it("repeats a sequence for the same seed", () => {
    const a = new Random(123), b = new Random(123);
    expect([a.next(), a.next(), a.next()]).toEqual([b.next(), b.next(), b.next()]);
  });
});
