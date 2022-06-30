const gameService = require('../../services/gameService.js');
const { flag } = require('../utils/icons.js');

/**
 * @param {*} _data 
 * @param {*} props 
 * @returns 
 */
function content(_data, props) {
    return {
        type: "widget",
        name: "gameList",
        query: {
            "$find": {
                "_datastore": gameService.datastoreName,
                "_refs": {
                    "$contains": "@me"
                },
                // "finished": false
            }
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
}