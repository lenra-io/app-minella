const gameService = require('../../services/gameService.js');
const filterService = require('../../services/filterService.js');
const { flag } = require('../utils/icons.js');

/**
 * @param {*} _data 
 * @param {*} props 
 * @returns 
 */
function content(_data, props) {
    return {
        type: "widget",
        name: "home_filters",
        coll: filterService.collection,
        query: {
            user: "@me"
        }
    }
}

function filters(filters, props) {
    const filter = filters[0] || {};
    // TODO: Display filters
    // TODO: filter the query with the filters
    return {
        type: "widget",
        name: "gameList",
        coll: gameService.collection,
        query: {
            user: "@me",
            finished: false
        },
        props: {
            userData: props.user
        }
    }
}

/**
 * @param {*} _data 
 * @param {*} props 
 * @returns 
 */
function menu(_data, props) {
    return {
        type: "widget",
        name: "menu",
        props: {
            mainAction: {
                text: "New game",
                onPressed: {
                    action: "pushState",
                    props: {
                        page: "newGame"
                    }
                }
            }
        }
    }
}

module.exports = {
    content,
    menu,
    filters,
}