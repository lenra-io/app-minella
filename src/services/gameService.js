'use strict'

import { createDoc, getDoc, updateDoc } from "./lenraDocumentService.js";
import Game from "../classes/Game.js";
export const collection = 'games';

/**
 * @param {*} api
 * @param {Game} game The game
 * @returns {Promise<Game>}
 */
export async function createGame(api, game) {
    return createDoc(api, collection, game);
}
/**
 * @param {*} api
 * @param {number} gameId The game id
 * @returns {Promise<Game>}
 */
export async function getGame(api, gameId) {
    return getDoc(api, collection, gameId);
}
/**
 * @param {*} api
 * @param {Game} game
 * @returns {Promise<Game>}
 */
export async function updateGame(api, game) {
    return await updateDoc(api, collection, game);
}
