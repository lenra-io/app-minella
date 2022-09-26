'use strict'

const dataService = require("./lenraDocumentService.js");
const Board = require('../classes/Board.js');
const collection = 'boards';

module.exports = {
    collection,
    /**
     * @param {*} api 
     * @param {Board} board The board 
     * @returns {Promise<Board>}
     */
    async createBoard(api, board) {
        return dataService.createDoc(api, collection, board);
    },
    /**
     * @param {*} api 
     * @param {string} boardId The board id
     * @returns {Promise<Board>}
     */
    async getBoard(api, boardId) {
        return dataService.getDoc(api, collection, boardId);
    },
    /**
     * @param {*} api 
     * @param {Board} board 
     * @returns {Promise<Board>}
     */
    async updateBoard(api, board) {
        return await dataService.updateData(api, collection, board);
    }
}
