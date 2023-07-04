export default class Cell {
    /**
     * @param {number} x Horizontal position from left cell starting at 0
     * @param {number} y Vertical position from top cell starting at 0
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Check if the given cell is equal to the current one
     * @param {Cell} cell The cell to compare
     */
    equals(cell) {
        if (!cell) return false;
        return this.x==cell.x && this.y==cell.y;
    }
}
