'use strict'

const dataService = require("./lenraDocumentService.js");
const Game = require("../classes/Game.js");
const collection = 'games';

module.exports = {
    collection,
    /**
     * @param {*} api 
     * @param {Game} game The game 
     * @returns {Promise<Game>}
     */
    async createGame(api, game) {
        return dataService.createDoc(api, collection, game);
    },
    /**
     * @param {*} api 
     * @param {number} gameId The game id
     * @returns {Promise<Game>}
     */
    async getGame(api, gameId) {
        return dataService.getData(api, collection, gameId);
    },
    /**
     * @param {*} api 
     * @param {Game} game 
     * @returns {Promise<Game>}
     */
    async updateGame(api, game) {
        return await dataService.updateData(api, collection, game);
    }
}
