export class Mission {
  check(state) {
    if (state.units.filter(u => u.team === "RAIDERS" && u.status === "alive").length === 0) {
      state.mission.status = "DEFEAT";
      return "DEFEAT";
    }
    // Exact original mission conditions must be filled from verified source material.
    return "ACTIVE";
  }
}
