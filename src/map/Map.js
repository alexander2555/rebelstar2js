export class MapModel {
  constructor(data) {
    this.data = data;
  }
  index(x, y) { return y * this.data.width + x; }
  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.data.width && y < this.data.height;
  }
  tile(x, y) {
    if (!this.inBounds(x, y)) return null;
    return this.data.tiles[this.index(x, y)];
  }
  canEnter(x, y) {
    if (!this.inBounds(x, y)) return false;
    return this.tile(x, y) !== 1;
  }
}
