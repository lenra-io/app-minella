const Game = require('../../classes/Game.js');
const Player = require('../../classes/Player.js');
const gameService = require('../../services/gameService.js');
const boardService = require('../../services/boardService.js');
const playerService = require('../../services/playerService.js');
const { flag } = require('../utils/icons.js');
const ui = require('../utils/ui.js');
const config = require('../../config.json');

/**
 * @param {*} _data 
 * @param {*} props 
 * @returns 
 */
function content(_data, props) {
    console.log("game_content", props);
    return {
        type: "widget",
        name: "game_gameContent",
        query: {
            "$find": {
                "_datastore": gameService.datastoreName,
                "_id": props.state.game
            }
        },
        props: {
            player: props.state.player
        }
    }
}

/**
 * @param {Game[]} games 
 * @param {*} props 
 * @returns 
 */
function gameContent(games, props) {
    const game = games[0];
    return {
        type: "widget",
        name: "game_playerContent",
        query: {
            "$find": {
                "_datastore": playerService.datastoreName,
                "_refs": {
                    "$contains": game._id
                }
            }
        },
        props: {
            game,
            player: props.player
        }
    };
    const children = [
    ];
    if (game.finished) {
        children.unshift({
            type: "text",
            style: {
                fontSize: 20,
                fontWeight: "w900"
            },
            value: ""
        });
    }
    return {
        type: "flex",
        direction: "vertical",
        // mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        // fillParent: true,
        // scroll: true,
        spacing: 2,
        children
    }
}

/**
 * @param {Player[]} players 
 * @param {*} props 
 * @returns 
 */
function playerContent(players, props) {
    console.log("playerContent", props);
    const player = players.find(p => p._id == props.player);
    const difficulty = config.difficulties[props.game.difficulty];
    const children = [
        boardHeader(difficulty.bombs, players, player),
        {
            type: "widget",
            name: "board",
            query: {
                "$find": {
                    "_datastore": boardService.datastoreName,
                    "_refs": {
                        "$contains": props.game._id
                    }
                }
            },
            props: {
                game: props.game._id,
                player: player._id,
                myTurn: props.game.playerNumber == 1 || player._id != props.game.lastPlayer
            }
        }
    ];
    if (props.game.finished) {
        children.unshift({
            type: "text",
            style: {
                fontSize: 20,
                fontWeight: "w900"
            },
            value: `${player._id==props.game.winner ? 'You won' : 'You lost'}`
        });
    }
    return {
        type: "flex",
        direction: "vertical",
        mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        // fillParent: true,
        // scroll: true,
        spacing: 2,
        padding: {
            top: 2,
            left: 2,
            right: 2,
            bottom: 2
        },
        children
    }
}

/**
 * @param {number} bombs Bomb number
 * @param {Player[]} players The players
 * @param {Player} currentPlayer The current player
 */
function boardHeader(bombs, players, currentPlayer) {
    console.log("boardHeader", players, currentPlayer);
    const remainingPins = bombs - currentPlayer.flags.length;
    const children = [
        {
            type: "button",
            text: flag,
            mainStyle: currentPlayer.flagging ? "primary" : "secondary",
            onPressed: {
                action: 'toggleFlagging',
                props: {
                    player: currentPlayer._id
                }
            }
        },
        {
            type: "container",
            padding: ui.padding.all(1),
            child: {
                type: "text",
                value: `${remainingPins}`
            }
        }
    ];
    return {
        type: "flex",
        spacing: 2,
        mainAxisAlignment: "center",
        fillParent: true,
        children
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
    gameContent,
    playerContent,
    menu,
}