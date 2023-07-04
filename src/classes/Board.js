import { Data } from '@lenra/app-server';

export default class Board extends Data {
    /**
     * @param {string} _id Doc id
     * @param {number[][]} cells The game cells
     */
    constructor(_id, cells) {
        super(_id);
        this.cells = cells;
    }
}
