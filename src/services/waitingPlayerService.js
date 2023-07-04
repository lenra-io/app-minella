'use strict'

import { createDoc, executeQuery, deleteDoc } from "./lenraDocumentService.js";
import WaitingPlayer from '../classes/WaitingPlayer.js';
export const collection = 'waitingPlayers';

/**
 * @param {*} api
 * @param {WaitingPlayer} player
 * @returns {Promise<WaitingPlayer>}
 */
export async function createWaitingPlayer(api, player) {
    return createDoc(api, collection, player);
}
/**
 * @param {*} api
 * @param {number} difficulty The game difficulty index
 * @param {number} playerNumber number of players of the game
 * @returns {Promise<WaitingPlayer>}
 */
export async function getWaitingPlayers(api, difficulty, playerNumber) {
    return executeQuery(api, collection, {
        difficulty,
        playerNumber,
        user: {
            $not: {
                $eq: "@me"
            }
        },
    });
}
/**
 * @param {*} api
 * @param {WaitingPlayer} player
 * @returns {Promise<void>}
 */
export async function deleteWaitingPlayer(api, player) {
    return await deleteDoc(api, collection, player);
}
