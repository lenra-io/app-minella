'use strict'

const { default: axios } = require("axios");
const LenraData = require('../classes/Document.js');

module.exports = {
    /**
     * Gets a document by id
     * @param {*} api The API call data
     * @param {string} coll The document collection
     * @param {string} id The data id
     * @returns {Promise<LenraData>}
     */
    getDoc(api, coll, id) {
        return axios.get(`${api.url}/app/colls/${coll}/docs/${id}`, options(api));
    },
    /**
     * Creates a document in a given collection
     * @param {*} api The API call data
     * @param {string} coll The document collection
     * @param {LenraData} doc The document to create
     * @returns {Promise<LenraData>}
     */
    createDoc(api, coll, doc) {
        return axios.post(`${api.url}/app/colls/${coll}/docs`, doc, options(api));
    },
    /**
     * Updates a given document
     * @param {*} api The API call data
     * @param {string} coll The document collection
     * @param {LenraData} doc The document to save
     * @returns {Promise<LenraData>}
     */
    updateDoc(api, coll, doc) {
        return axios.put(`${api.url}/app/colls/${coll}/docs/${doc._id}`, doc, options(api));
    },
    /**
     * Deletes a document
     * @param {*} api The API call data
     * @param {string} coll The document collection
     * @param {LenraData} doc The document to delete
     * @returns {Promise<void>}
     */
    deleteDoc(api, coll, doc) {
        return axios.delete(`${api.url}/app/colls/${coll}/docs/${doc._id}`, options(api));
    },
    /**
     * Executes a given query
     * @param {*} api The API call data
     * @param {string} coll The document collection
     * @param {*} query The query
     * @returns {Promise<LenraData[]>}
     */
    executeQuery(api, coll, query) {
        return axios.post(`${api.url}/app/colls/${coll}/docs/find`, query, options(api));
    }
}

function options(api) {
    return { headers: headers(api) }
}

function headers(api) {
    return { Authorization: `Bearer ${api.token}` }
}
