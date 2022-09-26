const Player = require('../../classes/Player.js');
const gameService = require('../../services/gameService.js');
const playerService = require('../../services/playerService.js');
const { flag } = require('../utils/icons.js');
const config = require('../../config.json');
const WaitingPlayer = require('../../classes/WaitingPlayer.js');
const waitingPlayerService = require('../../services/waitingPlayerService.js');

/**
 * @param {*} _data 
 * @param {*} props 
 * @returns 
 */
function content(_data, props) {
    return {
        type: "widget",
        name: "newGame_contentWaiting",
        coll: waitingPlayerService.collection,
        query: {
            user: "@me"
        },
        props
    }
}

/**
 * @param {WaitingPlayer[]} waitingPlayers 
 * @param {*} props 
 * @returns 
 */
function contentWaiting(waitingPlayers, props) {
    const difficulties = config.difficulties;
    console.log(waitingPlayers);
    const difficulty = "difficulty" in props.state ? props.state.difficulty : 0;
    const playerNumber = "playerNumber" in props.state ? props.state.playerNumber : 1;
    const waiting = waitingPlayers.filter(p => p.difficulty==difficulty && p.playerNumber==playerNumber).length > 0;
    return {
        type: "flex",
        direction: "vertical",
        spacing: 2,
        crossAxisAlignment: "center",
        children: [
            choiceSelector(
                "Type",
                "playerNumber",
                [{ display: "Single player", value: 1 }, { display: "Versus", value: 2 }],
                playerNumber
            ),
            choiceSelector(
                "Difficulty",
                "difficulty",
                difficulties.map((d, i) => ({
                    display: d.name,
                    value: i
                })),
                difficulty
            ),
            {
                type: "button",
                text: "Start",
                mainStyle: "primary",
                disabled: waiting,
                onPressed: {
                    action: 'createGame'
                }
            }
        ]
    }
}

/**
 * 
 * @param {string} name The display name of the property
 * @param {string} property The property name
 * @param {{display: string, value: any}[]} values Possible values
 * @param {any} value The current value
 */
function choiceSelector(name, property, values, value) {
    return {
        type: "flex",
        direction: "vertical",
        crossAxisAlignment: "center",
        spacing: 1,
        children: [
            {
                type: "text",
                value: name,
                style: {
                    fontWeight: "bold"
                },
            },
            {
                type: "flex",
                spacing: 2,
                children: values.map(v => ({
                    type: "button",
                    text: v.display,
                    mainStyle: v.value == value ? "primary" : "secondary",
                    onPressed: {
                        action: 'setStateProperty',
                        props: {
                            property,
                            value: v.value
                        }
                    }
                }))
            }
        ]
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
        name: "menu"
    }
}

module.exports = {
    content,
    contentWaiting,
    menu,
}