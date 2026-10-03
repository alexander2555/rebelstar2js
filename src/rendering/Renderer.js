export class Renderer {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;
  }

  render() {
    const { ctx, canvas, game } = this;
    const s = game.state;
    const cols = s.map.width;
    const rows = s.map.height;
    const tw = canvas.width / cols;
    const th = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = s.map.tiles[y * cols + x];
        ctx.fillStyle = tile === 1 ? "#555" : "#151515";
        ctx.fillRect(x * tw, y * th, tw - 1, th - 1);
      }
    }

    for (const u of s.units) {
      if (u.status !== "alive") continue;
      ctx.fillStyle = u.team === "RAIDERS" ? "#5cf" : "#f55";
      ctx.fillRect(u.x * tw + 3, u.y * th + 3, tw - 7, th - 7);
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(s.cursor.x * tw + 1, s.cursor.y * th + 1, tw - 2, th - 2);

    document.querySelector("#phase").textContent =
      `TURN ${s.turn} · ${s.phase} · ${s.mode}`;

    const u = s.units.find(x => x.id === s.activeUnitId);
    document.querySelector("#unit-info").innerHTML = u
      ? `<div class="panel"><b>${u.id}</b><br>HP: ${u.hp}/${u.maxHp}<br>AP: ${u.actionPoints}/${u.maxActionPoints}<br>Item: ${u.activeItem ?? "-"}</div>`
      : `<div class="panel">No active unit</div>`;

    const log = s.events.slice(-8).reverse().map(e =>
      `<div>${e.turn}: ${e.type}</div>`
    ).join("");
    document.querySelector("#message-log").innerHTML =
      `<div class="panel"><b>EVENTS</b>${log}</div>`;
  }
}
