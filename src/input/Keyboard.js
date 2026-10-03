import { DIR } from "../game/Rules.js";

export class Keyboard {
  constructor(game) { this.game = game; }

  attach() {
    window.addEventListener("keydown", e => {
      const k = e.key.toLowerCase();
      if (DIR[k]) {
        e.preventDefault();
        // In cursor mode the keys move the cursor.
        this.game.handleCommand({ type: "move", dx: DIR[k][0], dy: DIR[k][1] });
        return;
      }
      const map = {
        s: "select", n: "next", i: "info", f: "fire",
        p: "pickup", m: "drop", o: "change-item", l: "reload",
        "1": "fire-aimed", "2": "fire-snap", u: "opportunity",
        "0": "end-turn"
      };
      const command = map[k];
      if (command) {
        e.preventDefault();
        this.game.handleCommand({ type: command });
      }
    });
  }
}
