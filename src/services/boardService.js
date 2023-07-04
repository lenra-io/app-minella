'use strict'

import { createDoc, getDoc, updateDoc } from "./lenraDocumentService.js";
import Board from '../classes/Board.js';
export const collection = 'boards';


/**
 * @param {*} api
 * @param {Board} board The board
 * @returns {Promise<Board>}
 */
export async function createBoard(api, board) {
    return createDoc(api, collection, board);
}
/**
 * @param {*} api
 * @param {string} boardId The board id
 * @returns {Promise<Board>}
 */
export async function getBoard(api, boardId) {
        return getDoc(api, collection, boardId);
    }
/**
 * @param {*} api
 * @param {Board} board
 * @returns {Promise<Board>}
 */
export async function updateBoard(api, board) {
    return await updateDoc(api, collection, board);
}
