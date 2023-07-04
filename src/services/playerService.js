'use strict'

import { createDoc, getDoc, executeQuery, updateDoc } from "./lenraDocumentService.js";
import Player from '../classes/Player.js';
export const collection = 'players';

/**
 * @param {*} api
 * @param {Player} player
 * @returns {Promise<Player>}
 */
export async function createPlayer(api, player) {
    return createDoc(api, collection, player);
}
/**
 * @param {*} api
 * @param {string} playerId
 * @returns {Promise<Player>}
 */
export async function getPlayer(api, playerId) {
    return getDoc(api, collection, playerId);
}
/**
 * @param {*} api
 * @param {string} gameId
 * @returns {Promise<Player[]>}
 */
export async function getGamePlayers(api, gameId) {
    return executeQuery(api, collection, {
        game: gameId
    });
}
/**
 * @param {*} api
 * @param {Player} player
 * @returns {Promise<Player>}
 */
export async function updatePlayer(api, player) {
    return await updateDoc(api, collection, player);
}
