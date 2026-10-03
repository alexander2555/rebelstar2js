import { Game } from "./game/Game.js";
import { Renderer } from "./rendering/Renderer.js";
import { Keyboard } from "./input/Keyboard.js";
import { Mouse } from "./input/Mouse.js";
import mapData from "./data/map.json" with { type: "json" };
import weapons from "./data/weapons.json" with { type: "json" };

const canvas = document.querySelector("#game");
const game = new Game({ mapData, weapons, seed: 12345 });
const renderer = new Renderer(canvas, game);
new Keyboard(game).attach();
new Mouse(canvas, game).attach();

document.querySelectorAll("[data-action]").forEach(btn => {
  btn.addEventListener("click", () => game.handleCommand({ type: btn.dataset.action }));
});

function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}
frame();
