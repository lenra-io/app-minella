'use strict'

const dataService = require("./lenraDocumentService.js");
const collection = 'filters';

/**
     * @param {*} api 
     * @param {number} gameId The game id
     * @returns {Promise<Game>}
     */
async function getCurrentUserFilter(api) {
    const filters = dataService.executeQuery(api, collection, {
        user: "@me"
    });
    return filters[0];
}

module.exports = {
    collection,
    /**
     * @param {*} api 
     * @param {Game} game The game 
     * @returns {Promise<Game>}
     */
    async setFilter(api, prop, value) {
        let filter = getCurrentUserFilter(api);
        if (filter) {
            // TODO: check if props in filter list
            if (value === undefined)
                delete filter[prop];
            else
                filter[prop] = value;
            return dataService.updateDoc(api, collection, filter);
        }
        else {
            return dataService.createDoc(api, collection, {
                [prop]: value,
                user: "@me"
            });
        }
    },
    getCurrentUserFilter,
}
