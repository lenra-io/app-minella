import Game from '../classes/Game.js';
import { home, updateState } from '../services/navigationService.js';
import Navigation from '../classes/Navigation.js';
import Player, { FlagAction } from '../classes/Player.js';
import { RevealAction } from '../classes/Player.js';
import { difficulties } from '../../config.json';
import WaitingPlayer from '../classes/WaitingPlayer.js';
import Board from '../classes/Board.js';
import Cell from '../classes/Cell.js';
import { Api, props, event } from '@lenra/app-server';



/**
 * apply filters
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function applyFilter(props, event, api) {
  // const userData = await userService.getUser(api);
  // if (props.buttonType == "playTime") {
  //   userData.filters["startTime"] = "None";
  // } else if (props.buttonType == "startTime") {
  //   userData.filters["playTime"] = "None";
  // }
  // userData.filters[props.buttonType] = props.value;
  // await userService.updateUser(api, userData);
}

/**
 * reset filters
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function resetFilters(props, event, api) {
  // const userData = await userService.getUser(api);
  // userData.filters.difficulty = "All";
  // userData.filters.gameState = "All";
  // userData.filters.playTime = "None";
  // userData.filters.result = "All";
  // userData.filters.startTime = "None";
  // userData.filters[props.buttonType] = props.value;
  // await userService.updateUser(api, userData);
}

/**
 * Creates a category
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function createGame(props, event, api) {
  const navigation = await api.data.find(Navigation, {
    user: "@me"
  });
  const difficultyIndex = "difficulty" in navigation.state ? navigation.state.difficulty : 0;
  const difficulty = difficulties[difficultyIndex];
  const playerNumber = "playerNumber" in navigation.state ? navigation.state.playerNumber : 1;
  const promises = [];

  const playersIds = ["@me"];
  if (playerNumber != 1) {
    // Check if there waiting players with the same params
    // let waitingPlayers = await getWaitingPlayers(api, difficultyIndex, playerNumber);
    let waitingPlayers = await api.data.find(WaitingPlayer, {
      difficulty: difficultyIndex,
      playerNumber,
      user: {
        $not: {
          $eq: "@me"
        }
      },
    });

    if (waitingPlayers.length > 0) {
      const waitingPlayer = waitingPlayers[0];
      console.log("Found waiting player", waitingPlayer);
      playersIds.push(waitingPlayer.user);
      promises.push(api.data.deleteDoc(waitingPlayer));
    }
    else {
      let waitingPlayer = new WaitingPlayer();
      waitingPlayer.difficulty = difficultyIndex;
      waitingPlayer.playerNumber = playerNumber;
      waitingPlayer.user = "@me";
      waitingPlayer = await api.data.createDoc(waitingPlayer);
      console.log("Created waiting player", waitingPlayer);
      return home(api);
    }
  }

  let game = new Game();
  game.difficulty = difficultyIndex;
  game.playerNumber = playerNumber;

  const m = Array(difficulty.rows).fill(0).map(v => Array(difficulty.columns).fill(0));
  let cnt = 0;
  while (cnt < difficulty.bombs) {
    let x = Math.round(Math.random() * (difficulty.columns - 1));
    let y = Math.round(Math.random() * (difficulty.rows - 1));
    if (m[y][x] != -1) {
      m[y][x] = -1;
      for (let i = Math.max(0, x - 1); i <= Math.min(difficulty.columns - 1, x + 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(difficulty.rows - 1, y + 1); j++) {
          if (i == x && j == y) continue;
          if (m[j][i] != -1) m[j][i] += 1;
        }
      }
      ++cnt;
    }
  }
  let board = new Board();
  board.cells = m;
  board = await api.data.createDoc(board);

  game.board = board._id;
  game = await api.data.createDoc(game);

  const players = await Promise.all(
    playersIds.map(id => {
      let player = new Player();
      player.user = id;
      player.game = game._id;
      return api.data.createDoc(player);
    })
  );
  const currentPlayer = players.find(p => p.user = navigation.user);
  const firstPlayerPos = Math.round(Math.random() * (players.length - 1));
  const firstPlayer = players[firstPlayerPos];

  console.log("update game", game);
  game.users = playersIds;
  game.players = players.map(p => p._id);
  game.firstPlayer = firstPlayer._id;
  game = await api.data.updateDoc(game);

  console.log("game created", game, players);
  promises.push(updateState(api, navigation, {
    page: "game",
    game: game._id,
    player: currentPlayer._id
  }));
  return Promise.all(promises);
}

/**
 * Reveal a cell
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function revealCell(props, event, api) {
  // get game
  let game = await api.data.getDoc(Game, props.game);
  if (game.finished) return;
  // get board
  const board = await api.data.getDoc(Board, game.board);
  // get players
  const players = await api.data.find(Player, {
    game: props.game
  });

  const revealedCells = players.flatMap(p => p.revealedCells);

  // find current player
  const currentPlayer = players.find(p => p._id == props.player);

  // reveal the cells
  const cell = new Cell(props.x, props.y);
  let newRevealedCells = listRevealedCells(board.cells, revealedCells, cell);
  const isBomb = newRevealedCells == null;
  if (isBomb) newRevealedCells = [cell];
  else if (game.playerNumber > 1) {
    currentPlayer.points += newRevealedCells.reduce((points, c) => points + board.cells[c.y][c.x], 0);
  }
  const action = new RevealAction(
    Date.now(),
    newRevealedCells
  );
  // update the player
  currentPlayer.actions.push(action);
  [].push.apply(currentPlayer.revealedCells, newRevealedCells);
  await api.data.updateDoc(currentPlayer);
  game.lastPlayer = props.player;
  game.lastPlayDate = Date.now();
  if (game.startPlayDate === undefined) {
    game.startPlayDate = Date.now();
  }
  if (isBomb) {
    // TODO: handle multiplayer system
    console.log("Found bomb", game, currentPlayer);
    game = endGame(game, players, currentPlayer);
  }
  else {
    const difficulty = difficulties[game.difficulty];
    if (revealedCells.length == difficulty.rows * difficulty.columns - difficulty.bombs) {
      console.log("Game finished");
      game = endGame(game, players);
    }
  }
  await api.data.updateDoc(game);
}

/**
 *
 * @param {number[][]} cells
 * @param {Cell[]} revealedCells
 * @param {Cell} cell
 */
function listRevealedCells(cells, revealedCells, cell) {
  if (revealedCells.find(c => c.x == cell.x && c.y == cell.y)) return [];
  const value = cells[cell.y][cell.x];
  if (value < 0) return null;
  const ret = [cell];
  revealedCells.push(cell);
  if (value == 0) {
    for (let x = Math.max(0, cell.x - 1); x < Math.min(cells[0].length, cell.x + 2); x++) {
      for (let y = Math.max(0, cell.y - 1); y < Math.min(cells.length, cell.y + 2); y++) {
        if (revealedCells.find(c => x == c.c && y == c.y)) continue;
        ret.push.apply(ret, listRevealedCells(cells, revealedCells, new Cell(x, y)));
      }
    }
  }
  return ret;
}

/**
 * Toggle a flag on a cell
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function toggleFlag(props, event, api) {
  // get player
  const player = await api.data.getDoc(Player, props.player);
  const cell = new Cell(props.x, props.y);
  const pos = player.flags
    .findIndex(a => cell.equals(a));
  let game = await api.data.getDoc(Game, props.game);
  var numOfMaxflags = (game.difficulty == 0) ? 10 : ((game.difficulty == 1) ? 40 : 99);

  if (player.flags.length + 1 <= numOfMaxflags) {
    const action = new FlagAction(Date.now(), cell, pos == -1);
    if (pos == -1) player.flags.push(cell);
    else player.flags.splice(pos, 1);
    player.actions.push(action);
  }

  return api.data.updateDoc(player);
}

/**
 * Toggle current user flagging
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function toggleFlagging(props, event, api) {
  // get player
  const player = await api.data.getDoc(Player, props.player);
  player.flagging = !player.flagging;
  return api.data.updateDoc(player);
}

/**
 * Toggle current user flagging
 * @param {props} props
 * @param {event} event
 * @param {Api} api
 * @returns
 */
async function resign(props, event, api) {
  const gamePromise = api.data.getDoc(Game, props.game);
  const players = await api.data.find(Player, {
    game: props.game
  });
  const game = endGame(await gamePromise, players, players.find(p => p._id == props.player))
  await api.data.updateDoc(game);
}

/**
 * End a game
 * @param {Game} game The ending game
 * @param {Player[]} players The game players
 * @param {Player} loser The game loser
 */
function endGame(game, players, loser) {
  game.finished = true;
  if (game.playerNumber > 1) {
    if (loser) {
      game.winner = players.find(p => p._id != loser._id)._id;
    }
    else {
      if (players[0].points == players[1].points) game.winner = null;
      else game.winner = players[0].points > players[1].points ? players[0]._id : players[1]._id;
    }
  }
  else if (!loser) {
    game.winner = players[0]._id;
  }
  return game;
}

export default {
  createGame,
  revealCell,
  toggleFlag,
  toggleFlagging,
  applyFilter,
  resetFilters,
  resign,
}
