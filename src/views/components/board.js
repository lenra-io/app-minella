import Board from '../../classes/Board.js';
import Player from '../../classes/Player.js';
import { collection } from '../../services/playerService.js';
import { bomb, flag } from '../utils/icons.js';
import ui from '../utils/ui.js';

/**
 *
 * @param {Board[]} boards
 * @param {*} props
 * @returns
 */
export function board(boards, props) {
  const board = boards[0];

  return {
    type: "flex",
    scroll: true,
    children: [
      {
        type: "view",
        name: "boardPlayers",
        coll: collection,
        query: {
          game: props.game
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
export function boardPlayers(players, props) {
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
