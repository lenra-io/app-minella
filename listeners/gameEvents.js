const userService = require('../services/userService.js');
const Game = require('../classes/Game.js');
const gameService = require('../services/gameService.js');
const navigationService = require('../services/navigationService.js');
const Player = require('../classes/Player.js');
const playerService = require('../services/playerService.js');
const { RevealAction } = require('../classes/Player.js');
const config = require('../config.json');
const waitingPlayerService = require('../services/waitingPlayerService.js');
const WaitingPlayer = require('../classes/WaitingPlayer.js');
const Board = require('../classes/Board.js');
const boardService = require('../services/boardService.js');
const Cell = require('../classes/Cell.js');



/**
 * apply filters
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function applyFilter(props, event, api) {
  const userData = await userService.getUser(api);
  if (props.buttonType == "playTime") {
    userData.filters["startTime"] = "None";
  } else if (props.buttonType == "startTime") {
    userData.filters["playTime"] = "None";
  }
  userData.filters[props.buttonType] = props.value;
  await userService.updateUser(api, userData);
}

/**
 * reset filters
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function resetFilters(props, event, api) {
  const userData = await userService.getUser(api);
  userData.filters.difficulty = "All";
  userData.filters.gameState = "All";
  userData.filters.playTime = "None";
  userData.filters.result = "All";
  userData.filters.startTime = "None";
  userData.filters[props.buttonType] = props.value;
  await userService.updateUser(api, userData);
}

/**
 * Creates a category
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function createGame(props, event, api) {
  const navigation = await navigationService.getNavigation(api);
  const difficultyIndex = "difficulty" in navigation.state ? navigation.state.difficulty : 0;
  const difficulty = config.difficulties[difficultyIndex];
  const playerNumber = "playerNumber" in navigation.state ? navigation.state.playerNumber : 1;
  const promises = [];

  const playersIds = ["@me"];
  if (playerNumber != 1) {
    // Check if there waiting players with the same params
    let waitingPlayers = await waitingPlayerService.getWaitingPlayers(api, difficultyIndex, playerNumber);
    if (waitingPlayers.length > 0) {
      const waitingPlayer = waitingPlayers[0];
      console.log("Found waiting player", waitingPlayer);
      playersIds.push(waitingPlayer.user);
      promises.push(waitingPlayerService.deleteWaitingPlayer(api, waitingPlayer));
    }
    else {
      let waitingPlayer = new WaitingPlayer();
      waitingPlayer.difficulty = difficultyIndex;
      waitingPlayer.playerNumber = playerNumber;
      waitingPlayer.user = "@me";
      waitingPlayer = await waitingPlayerService.createWaitingPlayer(api, waitingPlayer);
      console.log("Created waiting player", waitingPlayer);
      return navigationService.home(api);
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
  board = await boardService.createBoard(api, board);

  game.users = playersIds;
  game.board = board._id;
  const gamePromise = gameService.createGame(api, game);

  const players = await Promise.all(
    playersIds.map(id => {
      let player = new Player();
      player.user = id;
      player.game = game._id;
      return playerService.createPlayer(api, player);
    })
  );
  console.log("players", players);
  const currentPlayer = players.find(p => p.user = navigation.user);
  const firstPlayerPos = Math.round(Math.random() * (players.length - 1));
  const firstPlayer = players[firstPlayerPos];
  game = await gamePromise;

  game.players = players.map(p => p._id);
  game.firstPlayer = firstPlayer._id;
  console.log("update game", game);
  game = await gameService.updateGame(api, game);

  console.log("game created", game, players);
  promises.push(navigationService.updateState(api, navigation, {
    page: "game",
    game: game._id,
    player: currentPlayer._id
  }));
  return Promise.all(promises);
}

/**
 * Reveal a cell
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function revealCell(props, event, api) {
  // get game
  const game = await gameService.getGame(api, props.game);
  if (game.finished) return;
  // get board
  const board = await boardService.getBoard(api, props.board);
  // get players
  const players = await playerService.getGamePlayers(api, props.game);

  const revealedCells = players.flatMap(p => p.revealedCells);

  // find current player
  const currentPlayer = players.find(p => p._id == props.player);

  // reveal the cells
  const cell = new Cell(props.x, props.y);
  let newRevealedCells = listRevealedCells(board.cells, revealedCells, cell);
  const isBomb = newRevealedCells == null;
  if (isBomb) newRevealedCells = [cell];
  else if (game.playerNumber > 1) {
    currentPlayer.points += newRevealedCells.reduce((score, c) => score + board.cells[c.y][c.x], 0);
  }
  const action = new RevealAction(
    Date.now(),
    newRevealedCells
  );
  // update the player
  currentPlayer.actions.push(action);
  [].push.apply(currentPlayer.revealedCells, newRevealedCells);
  await playerService.updatePlayer(api, currentPlayer);
  game.lastPlayer = props.player;
  game.lastPlayDate = Date.now();
  if (game.startPlayDate === undefined) {
    game.startPlayDate = Date.now();
  }
  if (isBomb) {
    // TODO: handle multiplayer system
    console.log("Found bomb", game, currentPlayer);
    game.finished = true;
    if (game.playerNumber > 1) {
      game.winner = players.find(p => p._id != currentPlayer._id)._id;
    }
  }
  else {
    [].push.apply(revealedCells, newRevealedCells);
    const difficulty = config.difficulties[game.difficulty];
    if (revealedCells.length == difficulty.rows * difficulty.columns - difficulty.bombs) {
      console.log("Game finished");
      game.finished = true;
      if (game.playerNumber > 1) {
        game.winner = players[0].score > players[1].score ? players[0]._id : players[1]._id;
      }
      else game.winner = currentPlayer._id;
    }
  }
  await gameService.updateGame(api, game);
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
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function toggleFlag(props, event, api) {
  // get player
  const player = await playerService.getPlayer(api, props.player);
  const cell = new Cell(props.x, props.y);
  const pos = player.flags
    .findIndex(a => cell.equals(a));
  var game = await gameService.getGame(api, props.game);
  var numOfMaxflags = (game.difficulty == 0) ? 10 : ((game.difficulty == 1) ? 40 : 99);

  if (player.flags.length + 1 <= numOfMaxflags) {
    const action = new Player.FlagAction(Date.now(), cell, pos == -1);
    if (pos == -1) player.flags.push(cell);
    else player.flags.splice(pos, 1);
    player.actions.push(action);
  }

  return playerService.updatePlayer(api, player);
}

/**
 * Toggle current user flagging
 * @param {*} props
 * @param {*} event
 * @param {*} api
 * @returns 
 */
async function toggleFlagging(props, event, api) {
  // get player
  const player = await playerService.getPlayer(api, props.player);
  player.flagging = !player.flagging;
  return playerService.updatePlayer(api, player);
}

module.exports = {
  createGame,
  revealCell,
  toggleFlag,
  toggleFlagging,
  applyFilter,
  resetFilters
}