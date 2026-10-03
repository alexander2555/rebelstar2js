export const PHASE = Object.freeze({
  PLAYER: "PLAYER",
  ALIEN: "ALIEN"
});

export const MODE = Object.freeze({
  CURSOR: "CURSOR",
  SELECT: "SELECT",
  FIRE: "FIRE"
});

export const SHOT = Object.freeze({
  AIMED: "AIMED",
  SNAP: "SNAP",
  OPPORTUNITY: "OPPORTUNITY"
});

export const DIR = Object.freeze({
  q: [-1,-1], w: [0,-1], e: [1,-1],
  a: [-1,0],  d: [1,0],
  z: [-1,1],  x: [0,1],  c: [1,1]
});

// Values below are intentionally not asserted to be original values.
// Replace them only after verification against primary/reference material.
export const DEFAULT_RULES = Object.freeze({
  moveAP: 1,
  aimedShotAP: 4,
  snapShotAP: 2,
  pickupAP: 1,
  dropAP: 1,
  reloadAP: 2
});
