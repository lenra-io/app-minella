'use strict'

const dataService = require("./lenraDocumentService.js");
const WaitingPlayer = require('../classes/WaitingPlayer.js');
const collection = 'waitingPlayers';

module.exports = {
    collection,
    /**
     * @param {*} api 
     * @param {WaitingPlayer} player 
     * @returns {Promise<WaitingPlayer>}
     */
    async createWaitingPlayer(api, player) {
        return dataService.createData(api, collection, player);
    },
    /**
     * @param {*} api 
     * @param {number} difficulty The game difficulty index
     * @param {number} playerNumber number of players of the game
     * @returns {Promise<WaitingPlayer>}
     */
    async getWaitingPlayers(api, difficulty, playerNumber) {
        return dataService.executeQuery(api, collection, {
            difficulty,
            playerNumber
        });
    },
    /**
     * @param {*} api 
     * @param {WaitingPlayer} player 
     * @returns {Promise<void>}
     */
    async deleteWaitingPlayer(api, player) {
        return await dataService.deleteData(api, collection, player._id);
    }
}
