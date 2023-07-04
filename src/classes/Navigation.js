import { Data } from '@lenra/app-server';
import Document from './Document.js';

export default class Navigation extends Data {
    /**
     * @param {string} _id Doc id
     * @param {any} state The navigation state
     * @param {any[]} history
     */
    constructor(_id, state, history) {
        super(_id);
        this.state = state;
        this.history = history;
    }
}
