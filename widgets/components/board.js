const Board = require('../../classes/Board.js');
const Player = require('../../classes/Player.js');
const playerService = require('../../services/playerService.js');
const { bomb, flag } = require('../utils/icons.js');
const ui = require('../utils/ui.js');

/**
 * 
 * @param {Board[]} boards 
 * @param {*} props 
 * @returns 
 */
function board(boards, props) {
  const board = boards[0];

  return {
    type: "flex",
    scroll: true,
    children: [
      {
        type: "widget",
        name: "boardPlayers",
        query: {
          "$find": {
            "_datastore": playerService.datastoreName,
            "_refs": {
              "$contains": props.game
            }
          }
        },
        props: {
          game: props.game,
          board: board._id,
          cells: board.cells,
          player: props.player,
          myTurn: props.myTurn
        }
      }
    ]
  }
}

/**
 * 
 * @param {Player[]} players 
 * @param {*} props 
 * @returns 
 */
function boardPlayers(players, props) {
  const currentPlayer = players.find(p => p._id == props.player);
  return {
    type: "flex",
    direction: "vertical",
    children: props.cells.map((cells, y) => ({
      type: "flex",
      direction: "horizontal",
      children: cells.map((value, x) => {
        const revealed = players.some(p => p.revealedCells.some(c => c.x == x && c.y == y)),
          flagged = currentPlayer.flags.find(c => c.x == x && c.y == y);

        const pressable = !revealed && (currentPlayer.flagging || !flagged && props.myTurn);

        var ret = {
          type: "container",
          constraints: ui.constraints.all(32),
          border: ui.border.all({
            color: ui.color.black,
            width: pressable ? 2 : 1
          }),
          decoration: {
            color: !revealed ? ui.color.grey : (flagged || currentPlayer.revealedCells.some(c => c.x == x && c.y == y) ? ui.color.blue : ui.color.red)
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
              value: cellText(value, flagged, revealed)
            }]
          }
        }
        if (pressable) {
          ret = {
            type: "actionable",
            child: ret,
            onPressed: {
              action: currentPlayer.flagging ? "toggleFlag" : "revealCell",
              props: {
                x,
                y,
                game: props.game,
                board: props.board,
                player: currentPlayer._id
              }
            }
          }
        }
        return ret;
      })
    }))
  };
}

function cellText(value, flagged, revealed) {
  if (flagged) return flag;
  if (!revealed || value == 0) return "";
  if (value == -1) return bomb;
  return `${value}`;
}


module.exports = {
  board,
  boardPlayers
}