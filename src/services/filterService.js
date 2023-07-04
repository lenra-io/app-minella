'use strict'

import { executeQuery, updateDoc, createDoc } from "./lenraDocumentService.js";
export const collection = 'filters';

/**
     * @param {*} api
     * @param {number} gameId The game id
     * @returns {Promise<Game>}
     */
export async function getCurrentUserFilter(api) {
    const filters = await executeQuery(api, collection, {
        user: "@me"
    });
    return filters[0];
}


/**
 * @param {*} api
 * @param {Game} game The game
 * @returns {Promise<Game>}
 */
export async function setFilter(api, prop, value) {
    let filter = await getCurrentUserFilter(api);
    if (filter) {
        // TODO: check if props in filter list
        if (value === undefined)
            delete filter[prop];
        else
            filter[prop] = value;
        return updateDoc(api, collection, filter);
    }
    else {
        return createDoc(api, collection, {
            [prop]: value,
            user: "@me"
        });
    }
}
