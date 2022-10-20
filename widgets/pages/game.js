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
    console.log("game::content", props);
    return {
        type: "widget",
        name: "game_gameContent",
        coll: gameService.collection,
        query: {
            "_id": props.state.game
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
    console.log("game::gameContent", game, props);
    const children = [
        {
            type: "widget",
            name: "game_playerContent",
            coll: playerService.collection,
            query: {
                game: game._id
            },
            props: {
                game,
                player: props.player
            }
        }
    ];
    if (game.playerNumber>1) {
        children.push({
            type: "button",
            text: "Resign",
            disabled: game.finished,
            onPressed: {
                action: 'resign',
                props: {
                    game: game._id,
                    player: props.player
                }
            }
        });
    }
    return {
        type: "flex",
        direction: "vertical",
        mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        // fillParent: true,
        // scroll: true,
        spacing: 16,
        children
    }
}

/**
 * @param {Player[]} players 
 * @param {{game: Game}} props 
 * @returns 
 */
function playerContent(players, props) {
    console.log("game::playerContent", players, props);
    const player = players.find(p => p._id == props.player);
    const difficulty = config.difficulties[props.game.difficulty];
    let myTurn = true;
    if (props.game.playerNumber>1) {
        if (props.game.lastPlayer) myTurn = player._id != props.game.lastPlayer;
        else myTurn = player._id == props.game.firstPlayer;
    }
    const children = [
        boardHeader(difficulty.bombs, players, player),
        {
            type: "widget",
            name: "board",
            coll: boardService.collection,
            query: {
                _id: props.game.board
            },
            props: {
                game: props.game._id,
                player: player._id,
                myTurn
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
            value: `${player._id == props.game.winner ? 'You won' : 'You lose'}`
        });
    }
    return {
        type: "flex",
        direction: "vertical",
        mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        // fillParent: true,
        // scroll: true,
        spacing: 16,
        padding: ui.padding.all(16),
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
            padding: ui.padding.all(8),
            child: {
                type: "text",
                value: `${remainingPins}`
            }
        }
    ];
    let ret = {
        type: "flex",
        spacing: 8,
        mainAxisAlignment: "center",
        children
    };

    if (players.length>1) {
        let otherPlayer = players.filter(p => p._id!=currentPlayer._id)[0];
        ret = {
            type: "flex",
            spacing: 16,
            mainAxisAlignment: "center",
            crossAxisAlignment: "center",
            children: [
                playerCounter(currentPlayer, true),
                ret,
                playerCounter(otherPlayer, false),
            ]
        };
    }
    ret.fillParent = true;

    return ret;
}

/**
 * 
 * @param {Player} player The player
 * @param {boolean} isCurrentPlayer True if the given player is the current one
 * @returns 
 */
function playerCounter(player, isCurrentPlayer) {
    console.log("player", player);
    return {
        type: "container",
        constraints: ui.constraints.all(32),
        border: ui.border.all({
          color: ui.color.black,
          width: isCurrentPlayer ? 2 : 1
        }),
        decoration: {
          color: isCurrentPlayer ? ui.color.blue : ui.color.red
        },
        child: {
          type: "flex",
          mainAxisAlignment: "center",
          crossAxisAlignment: "center",
          children: [{
            type: "text",
            style: {
              fontSize: 16,
              fontWeight: "w900"
            },
            value: `${player.points || 0}`,
          }]
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
        name: "menu"
    }
}

module.exports = {
    content,
    gameContent,
    playerContent,
    menu,
}