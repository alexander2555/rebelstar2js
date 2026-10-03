export function getRay(x0, y0, x1, y1) {
  const points = [];
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    points.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return points;
}

export function hasLineOfSight(map, shooter, target) {
  const ray = getRay(shooter.x, shooter.y, target.x, target.y);
  for (const [x, y] of ray.slice(1, -1)) {
    if (map.tile(x, y) === 1) return false;
  }
  return true;
}
