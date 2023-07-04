import Game from '../../classes/Game.js';
import Player from '../../classes/Player.js';
import { collection } from '../../services/gameService.js';
import { collection as _collection } from '../../services/boardService.js';
import { collection as __collection } from '../../services/playerService.js';
import { flag } from '../utils/icons.js';
import { padding as _padding, constraints as _constraints, border as _border, color as _color } from '../utils/ui.js';
import { difficulties } from '../../config.json';

/**
 * @param {*} _data
 * @param {*} props
 * @returns
 */
export function content(_data, props) {
    return {
        type: "view",
        name: "game_gameContent",
        coll: collection,
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
export function gameContent(games, props) {
    const game = games[0];
    const children = [
        {
            type: "view",
            name: "game_playerContent",
            coll: __collection,
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
export function playerContent(players, props) {
    const player = players.find(p => p._id == props.player);
    if (!player) throw new Error(`Current player ${props.player} not found in ${players}`);
    const difficulty = difficulties[props.game.difficulty];
    let myTurn = true;
    if (props.game.playerNumber>1) {
        if (props.game.lastPlayer) myTurn = player._id != props.game.lastPlayer;
        else myTurn = player._id == props.game.firstPlayer;
    }
    const children = [
        boardHeader(difficulty.bombs, players, player),
        {
            type: "view",
            name: "board",
            coll: _collection,
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
        padding: _padding.all(16),
        children
    }
}

/**
 * @param {number} bombs Bomb number
 * @param {Player[]} players The players
 * @param {Player} currentPlayer The current player
 */
function boardHeader(bombs, players, currentPlayer) {
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
            padding: _padding.all(8),
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
    return {
        type: "container",
        constraints: _constraints.all(32),
        border: _border.all({
          color: _color.black,
          width: isCurrentPlayer ? 2 : 1
        }),
        decoration: {
          color: isCurrentPlayer ? _color.blue : _color.red
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
export function menu(_data, props) {
    return {
        type: "view",
        name: "menu"
    }
}
