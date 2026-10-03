export class Mouse {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.tileSize = 24;
  }

  attach() {
    this.canvas.addEventListener("click", e => {
      const r = this.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / (r.width / this.game.state.map.width));
      const y = Math.floor((e.clientY - r.top) / (r.height / this.game.state.map.height));
      this.game.state.cursor = { x, y };
    });
  }
}
