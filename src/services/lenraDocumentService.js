"use strict";

import { default as axios } from "axios";
import LenraData from "../classes/Document.js";

export /**
 * Gets a document by id
 * @param {*} api The API call data
 * @param {string} coll The document collection
 * @param {string} id The data id
 * @returns {Promise<LenraData>}
 */
async function getDoc(api, coll, id) {
  return (
    await axios.get(`${api.url}/app/colls/${coll}/docs/${id}`, options(api))
  ).data;
}
export /**
 * Creates a document in a given collection
 * @param {*} api The API call data
 * @param {string} coll The document collection
 * @param {LenraData} doc The document to create
 * @returns {Promise<LenraData>}
 */
async function createDoc(api, coll, doc) {
  return (
    await axios.post(`${api.url}/app/colls/${coll}/docs`, doc, options(api))
  ).data;
}
export /**
 * Updates a given document
 * @param {*} api The API call data
 * @param {string} coll The document collection
 * @param {LenraData} doc The document to save
 * @returns {Promise<LenraData>}
 */
async function updateDoc(api, coll, doc) {
  return (
    await axios.put(
      `${api.url}/app/colls/${coll}/docs/${doc._id}`,
      doc,
      options(api)
    )
  ).data;
}
export function deleteDoc(api, coll, doc) {
  return axios.delete(
    `${api.url}/app/colls/${coll}/docs/${doc._id}`,
    options(api)
  );
}
export /**
 * Executes a given query
 * @param {*} api The API call data
 * @param {string} coll The document collection
 * @param {*} query The query
 * @returns {Promise<LenraData[]>}
 */
async function executeQuery(api, coll, query) {
  return (
    await axios.post(
      `${api.url}/app/colls/${coll}/docs/find`,
      query,
      options(api)
    )
  ).data;
}

function options(api) {
  return { headers: headers(api) };
}

function headers(api) {
  return { Authorization: `Bearer ${api.token}` };
}
