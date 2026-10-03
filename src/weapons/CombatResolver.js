import { hasLineOfSight } from "../map/LineOfSight.js";
import { SHOT, DEFAULT_RULES } from "../game/Rules.js";

export class CombatResolver {
  constructor({ rng, rules = DEFAULT_RULES }) {
    this.rng = rng;
    this.rules = rules;
  }

  resolveShot({ shooter, target, weapon, shotType, map }) {
    const los = hasLineOfSight(map, shooter, target);
    if (!los) {
      return { hit: false, damage: 0, apCost: 0, reason: "NO_LOS" };
    }

    const apCost =
      shotType === SHOT.AIMED ? (weapon.aimedAP ?? this.rules.aimedShotAP) :
      shotType === SHOT.SNAP ? (weapon.snapAP ?? this.rules.snapShotAP) :
      0;

    if (shooter.actionPoints < apCost) {
      return { hit: false, damage: 0, apCost: 0, reason: "NO_AP" };
    }

    const accuracy =
      shotType === SHOT.AIMED ? (weapon.aimedAccuracy ?? weapon.accuracy) :
      (weapon.snapAccuracy ?? weapon.accuracy);

    const roll = this.rng.int(1, 100);
    const hit = roll <= accuracy;
    return {
      hit,
      damage: hit ? (weapon.damage ?? 1) : 0,
      apCost,
      roll,
      accuracy
    };
  }
}
