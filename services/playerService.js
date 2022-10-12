'use strict'

const dataService = require("./lenraDocumentService.js");
const Player = require('../classes/Player.js');
const collection = 'players';

module.exports = {
    collection,
    /**
     * @param {*} api 
     * @param {Player} player 
     * @returns {Promise<Player>}
     */
    async createPlayer(api, player) {
        return dataService.createDoc(api, collection, player);
    },
    /**
     * @param {*} api 
     * @param {number} playerId 
     * @returns {Promise<Player>}
     */
    async getPlayer(api, playerId) {
        return dataService.getDoc(api, collection, playerId);
    },
    /**
     * @param {*} api 
     * @param {number} gameId 
     * @returns {Promise<Player[]>}
     */
    async getGamePlayers(api, gameId) {
        return dataService.executeQuery(api, collection, {
            game: gameId
        });
    },
    /**
     * @param {*} api 
     * @param {Player} player 
     * @returns {Promise<Player>}
     */
    async updatePlayer(api, player) {
        return await dataService.updateDoc(api, collection, player);
    }
}
