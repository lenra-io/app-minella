const Document = require('./Document.js');

module.exports = class Board extends Document {
    /**
     * @param {string} _id Doc id
     * @param {number[][]} cells The game cells
     */
    constructor(_id, cells) {
        super(_id);
        this.cells = cells;
    }
}