import Player from '../../classes/Player.js';
import gameService from '../../services/gameService.js';
import playerService from '../../services/playerService.js';
import { flag } from '../utils/icons.js';
import { difficulties as _difficulties } from '../../config.json';
import WaitingPlayer from '../../classes/WaitingPlayer.js';
import { collection } from '../../services/waitingPlayerService.js';

/**
 * @param {*} _data
 * @param {*} props
 * @returns
 */
export function content(_data, props) {
    return {
        type: "view",
        name: "newGame_contentWaiting",
        coll: collection,
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
export function contentWaiting(waitingPlayers, props) {
    const difficulties = _difficulties;
    const difficulty = "difficulty" in props.state ? props.state.difficulty : 0;
    const playerNumber = "playerNumber" in props.state ? props.state.playerNumber : 1;
    const waiting = waitingPlayers.filter(p => p.difficulty==difficulty && p.playerNumber==playerNumber).length > 0;
    return {
        type: "flex",
        direction: "vertical",
        spacing: 16,
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
        spacing: 8,
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
                spacing: 16,
                children: values.map(v => ({
                    type: "button",
                    text: v.display,
                    mainStyle: v.value == value ? "primary" : "secondary",
                    onPressed: v.value == value ? undefined : {
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
export function menu(_data, props) {
    return {
        type: "view",
        name: "menu"
    }
}
