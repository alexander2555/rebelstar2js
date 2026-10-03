export function createInitialState({ mapData, units = [] } = {}) {
  return {
    version: 1,
    phase: "PLAYER",
    mode: "CURSOR",
    turn: 1,
    missionTime: 0,
    activeUnitId: units[0]?.id ?? null,
    cursor: { x: units[0]?.x ?? 0, y: units[0]?.y ?? 0 },
    camera: { x: 0, y: 0 },
    map: structuredClone(mapData ?? { width: 1, height: 1, tiles: [0] }),
    units: structuredClone(units),
    objects: [],
    events: [],
    objectives: {
      eggsCaptured: 0,
      queenDestroyed: false,
      extractionComplete: false
    },
    mission: {
      status: "ACTIVE",
      turnLimit: null
    }
  };
}

export function getUnit(state, id) {
  return state.units.find(u => u.id === id) ?? null;
}

export function getActiveUnit(state) {
  return getUnit(state, state.activeUnitId);
}

export function livingUnits(state, team) {
  return state.units.filter(u => u.team === team && u.status === "alive");
}
