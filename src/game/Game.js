import { createInitialState, getActiveUnit, getUnit } from "./GameState.js";
import { DIR, MODE, PHASE, SHOT, DEFAULT_RULES } from "./Rules.js";
import { MapModel } from "../map/Map.js";
import { CombatResolver } from "../weapons/CombatResolver.js";
import { Random } from "../utils/Random.js";
import { Mission } from "./Mission.js";

export class Game {
  constructor({ mapData, weapons = [], seed = 1 }) {
    const units = [
      {
        id: "R1", team: "RAIDERS", type: "RAIDER", x: 2, y: 2,
        hp: 10, maxHp: 10, actionPoints: 8, maxActionPoints: 8,
        inventory: ["laser_gun"], activeItem: "laser_gun", status: "alive",
        stats: { accuracy: 70, armour: 0 }
      },
      {
        id: "A1", team: "ALIENS", type: "ALIEN", x: 18, y: 12,
        hp: 10, maxHp: 10, actionPoints: 8, maxActionPoints: 8,
        inventory: ["alien_weapon"], activeItem: "alien_weapon", status: "alive",
        stats: { accuracy: 60, armour: 0 }
      }
    ];
    this.state = createInitialState({ mapData, units });
    this.map = new MapModel(this.state.map);
    this.weapons = new Map(weapons.map(w => [w.id, w]));
    this.rng = new Random(seed);
    this.combat = new CombatResolver({ rng: this.rng, rules: DEFAULT_RULES });
    this.mission = new Mission();
  }

  emit(type, data = {}) {
    this.state.events.push({ turn: this.state.turn, type, ...data });
    if (this.state.events.length > 100) this.state.events.shift();
  }

  handleCommand(command) {
    if (this.state.mission.status !== "ACTIVE") return false;
    switch (command.type) {
      case "move": return this.moveCursor(command.dx, command.dy);
      case "select": return this.selectAtCursor();
      case "next": return this.nextUnit();
      case "fire": return this.enterFireMode();
      case "fire-aimed": return this.fire(SHOT.AIMED);
      case "fire-snap": return this.fire(SHOT.SNAP);
      case "opportunity": return this.setOpportunityFire();
      case "pickup": return this.pickup();
      case "drop": return this.drop();
      case "change-item": return this.changeItem();
      case "reload": return this.reload();
      case "end-turn": return this.endTurn();
      default: return false;
    }
  }

  moveCursor(dx, dy) {
    const nx = Math.max(0, Math.min(this.state.map.width - 1, this.state.cursor.x + dx));
    const ny = Math.max(0, Math.min(this.state.map.height - 1, this.state.cursor.y + dy));
    this.state.cursor = { x: nx, y: ny };
    return true;
  }

  selectAtCursor() {
    const u = this.state.units.find(u =>
      u.status === "alive" && u.team === "RAIDERS" &&
      u.x === this.state.cursor.x && u.y === this.state.cursor.y
    );
    if (!u) return false;
    this.state.activeUnitId = u.id;
    this.state.mode = MODE.SELECT;
    this.emit("SELECT_UNIT", { unitId: u.id });
    return true;
  }

  nextUnit() {
    const alive = this.state.units.filter(u => u.team === "RAIDERS" && u.status === "alive");
    if (!alive.length) return false;
    const i = alive.findIndex(u => u.id === this.state.activeUnitId);
    const next = alive[(i + 1) % alive.length];
    this.state.activeUnitId = next.id;
    this.state.cursor = { x: next.x, y: next.y };
    return true;
  }

  enterFireMode() {
    const unit = getActiveUnit(this.state);
    if (!unit || unit.team !== "RAIDERS") return false;
    this.state.mode = MODE.FIRE;
    this.emit("ENTER_FIRE_MODE", { unitId: unit.id });
    return true;
  }

  moveActive(dx, dy) {
    const u = getActiveUnit(this.state);
    if (!u || u.status !== "alive") return false;
    const nx = u.x + dx, ny = u.y + dy;
    if (!this.map.canEnter(nx, ny)) return false;
    if (u.actionPoints < DEFAULT_RULES.moveAP) return false;
    u.x = nx; u.y = ny;
    u.actionPoints -= DEFAULT_RULES.moveAP;
    this.state.cursor = { x: nx, y: ny };
    return true;
  }

  fire(shotType) {
    const shooter = getActiveUnit(this.state);
    if (!shooter || this.state.mode !== MODE.FIRE) return false;
    const target = this.state.units.find(u =>
      u.status === "alive" && u.team !== shooter.team &&
      u.x === this.state.cursor.x && u.y === this.state.cursor.y
    );
    if (!target) return false;
    const weapon = this.weapons.get(shooter.activeItem);
    if (!weapon) return false;
    const result = this.combat.resolveShot({
      shooter, target, weapon, shotType, map: this.map
    });
    shooter.actionPoints = Math.max(0, shooter.actionPoints - result.apCost);
    if (result.hit) {
      target.hp = Math.max(0, target.hp - result.damage);
      if (target.hp === 0) target.status = "dead";
    }
    this.emit("SHOT", { shooterId: shooter.id, targetId: target.id, ...result });
    this.state.mode = MODE.SELECT;
    return true;
  }

  setOpportunityFire() {
    const u = getActiveUnit(this.state);
    if (!u || this.state.mode !== MODE.FIRE) return false;
    u.opportunityFire = { enabled: true, weaponId: u.activeItem };
    this.emit("OPPORTUNITY_FIRE_SET", { unitId: u.id });
    this.state.mode = MODE.SELECT;
    return true;
  }

  pickup() { this.emit("TODO_PICKUP"); return false; }
  drop() { this.emit("TODO_DROP"); return false; }
  changeItem() { this.emit("TODO_CHANGE_ITEM"); return false; }
  reload() { this.emit("TODO_RELOAD"); return false; }

  endTurn() {
    for (const u of this.state.units.filter(u => u.team === "RAIDERS" && u.status === "alive")) {
      u.actionPoints = u.maxActionPoints;
    }
    this.state.phase = PHASE.ALIEN;
    this.state.turn += 1;
    this.emit("END_PLAYER_TURN");
    // AI is intentionally isolated and can be expanded without changing the state model.
    for (const u of this.state.units.filter(u => u.team === "ALIENS" && u.status === "alive")) {
      u.actionPoints = u.maxActionPoints;
    }
    this.state.phase = PHASE.PLAYER;
    this.state.mode = MODE.CURSOR;
    this.emit("BEGIN_PLAYER_TURN");
    this.mission.check(this.state);
    return true;
  }

  serialize() {
    return JSON.stringify(this.state);
  }

  load(serialized) {
    const next = JSON.parse(serialized);
    this.state = next;
    this.map = new MapModel(this.state.map);
  }
}
