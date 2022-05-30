const LenraData = require('./LenraData.js');
const Cell = require('./Cell.js');

class PlayerAction {
    /**
     * 
     * @param {number} timestamp The timestamp of the action
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
    }
}

class RevealAction extends PlayerAction {
    /**
     * @param {number} timestamp The timestamp of the action
     * @param {Cell[]} revealedCells The cells revealed by the action
     */
    constructor(timestamp, revealedCells) {
        super(timestamp);
        this.revealedCells = revealedCells;
    }
}

class FlagAction extends PlayerAction {
    /**
     * @param {number} timestamp The timestamp of the action
     * @param {Cell} cell The cell of the action
     * @param {boolean} add If true the flag is added else it's removed
     */
    constructor(timestamp, cell, add) {
        super(timestamp);
        this.cell = cell;
        this.add = add;
    }
}

module.exports = class Player extends LenraData {
    /**
     * @param {number} _id Data id
     * @param {string} _datastore The datastore where the data is stored
     * @param {number[]} _refs The data references to other datas
     * @param {number[]} _refBy The other datas referencing the current data
     * @param {Action[]} actions The player actions
     * @param {boolean} flagging If true, the player is adding flags
     * @param {Cell[]} revealedCells The player revealed cells
     * @param {Cell[]} flags The player flags
     * @param {number} score The player score
     */
    constructor(_id, _datastore, _refs, _refBy, actions, flagging, revealedCells, flags, score) {
        super(_id, _datastore, _refs, _refBy);
        this.actions = actions || [];
        this.flagging = flagging;
        this.revealedCells = revealedCells || [];
        this.flags = flags || [];
        this.score = score || 0;
    }

    static RevealAction = RevealAction;
    static FlagAction = FlagAction;
}