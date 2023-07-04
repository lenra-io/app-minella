import { Data } from '@lenra/app-server';
import Document from './Document.js';

export default class WaitingPlayer extends Data {
    /**
     * @param {string} _id Doc id
     * @param {number} difficulty The game difficulty index
     * @param {number} playerNumber number of players of the game
     */
    constructor(_id, difficulty, playerNumber) {
        super(_id);
        this.difficulty = difficulty;
        this.playerNumber = playerNumber;
    }
}
