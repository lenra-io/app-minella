const Game = require('../../classes/Game.js');
const Player = require('../../classes/Player.js');
const playerService = require('../../services/playerService.js');
const icons = require('../utils/icons.js');
const ui = require('../utils/ui.js');

/**
 * 
 * @param {Game[]} games The games to display
 * @param {*} props 
 * @returns 
 */
function gameList(games, props) {
    // var filters = props.userData.filters;
    // var startTimeNone = (filters.startTime == "None");
    // var playTimeNone = (filters.playTime == "None");
    // var difficultyAll = (filters.difficulty == "All");
    // var gameStateAll = (filters.gameState == "All");
    // var resultAll = (filters.result == "All");
    // var difficultyFilter = games;
    // if (!difficultyAll) {
    //     var difficultDir = {
    //         0: "Easy",
    //         1: "Medium",
    //         2: "Hard",
    //     }
    //     difficultyFilter = games.filter(game => difficultDir[game.difficulty] == filters.difficulty);
    // }

    // var gameStateFilter = difficultyFilter;
    // if (!gameStateAll) {
    //     var gameStateDir = {
    //         "Finished": true,
    //         "Not Finished": undefined,
    //         "Not Started": undefined,
    //     }
    //     if (filters.gameState == "Finished") {
    //         gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished);
    //     } else if (filters.gameState == "Not Started") {
    //         gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished && game.lastPlayDate == undefined);
    //     } else {
    //         gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished && game.lastPlayDate != undefined);
    //     }
    // }

    // var resultFilter = gameStateFilter;
    // if (!resultAll) {
    //     var resultDir = {
    //         "Won": true,
    //         "Lost": false
    //     }
    //     if (filters.gameState == "Won") {
    //         resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner == undefined));
    //     } else {
    //         resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner != undefined) && game.finished);
    //     }
    // }
    // var resultFilter = gameStateFilter;
    // if (!resultAll) {
    //     var resultDir = {
    //         "Won": true,
    //         "Lost": false
    //     }
    //     if (filters.gameState == "Won") {
    //         resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner == undefined));
    //     } else {
    //         resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner != undefined) && game.finished);
    //     }
    // }

    // var startTimeFilter = resultFilter;
    // if (!startTimeNone) {
    //     startTimeFilter = (filters.startTime == "Asc") ? resultFilter.sort((a, b) => a.startPlayDate - b.startPlayDate) : resultFilter.sort((a, b) => b.startPlayDate - a.startPlayDate);
    // }

    // var playTimeFilter = startTimeFilter;
    // if (!playTimeNone) {
    //     playTimeFilter = (filters.playTime == "Asc") ? startTimeFilter.sort((a, b) => (a.lastPlayDate - a.startPlayDate) - (b.lastPlayDate - b.startPlayDate)) : startTimeFilter.sort((a, b) => (b.lastPlayDate - b.startPlayDate) - (a.lastPlayDate - a.startPlayDate));
    // }
    return {
        type: "flex",
        spacing: 16,
        direction: "vertical",
        padding: {
            bottom: 32
        },
        children: [
            ...games
                .map(game => {
                    return {
                        type: "widget",
                        name: "gameCard",
                        coll: playerService.collection,
                        query: {
                            game: game._id,
                            user: "@me"
                        },
                        props: {
                            game
                        }
                    }
                })
        ]
    };
}

function getProperTime(time) {
    return (String(time).length == 1) ? "0" + String(time) : String(time);
}

/**
 * 
 * @param {Player[]} players 
 * @param {{game: Game}} props
 * @returns 
 */
function gameCard(players, props) {
    const currentPlayer = players[0];
    var difficulty = props.game.difficulty;
    var finished = (props.game.finished) ? "Finished" : "Continue game";
    var result = (props.game.finished && props.game.winner != undefined) ? "with a win" : ((props.game.finished && props.game.winner == undefined) ? "with a lose" : "");
    var date = new Date(props.game.lastPlayDate);
    var day = getProperTime(date.getDate());
    var month = getProperTime(date.getMonth());
    var hours = getProperTime(date.getHours());
    var minutes = getProperTime(date.getMinutes());
    var dateformat = day + "/" + month + "/" + date.getFullYear() + " at " + hours + ":" + minutes;
    var playedTime = (props.game.lastPlayDate - props.game.startPlayDate);
    var duration = new Date(playedTime);

    var numberOfPlayer = props.game.playerNumber;
    var playerMode = (numberOfPlayer == 1) ? "solo mode" : "multiplayer mode";
    var descriptionText = (isNaN(date)) ? "Not started yet !" : "Played on " + dateformat + "\nWith " + getProperTime(duration.getHours()) + ":" + getProperTime(duration.getMinutes()) + ":" + getProperTime(duration.getSeconds()) + " of play time.";
    return {
        type: "actionable",
        child: {
            type: "container",
            border: ui.border.all({
                width: 0.5,
                color: 0xFFDCE0E7
            }),
            decoration: {
                color: currentPlayer._id != props.game.lastPlayer ? ui.color.blue : ui.color.white,
                boxShadow: {
                    blurRadius: 10,
                    offset: {
                        dx: 4,
                        dy: 4
                    },
                    color: ui.color.opacity(ui.color.black, 0.7)
                },
            },
            child: {
                type: "flex",
                spacing: 16,
                mainAxisAlignment: "spaceEvenly",
                direction: "vertical",
                padding: {
                    left: 16,
                    right: 16
                },
                children: [
                    {
                        type: "flex",
                        spacing: 16,
                        children: [{
                            type: "text",
                            style: {
                                fontSize: 16
                            },
                            value: props.game.playerNumber == 1 ? icons.singlePlayer : icons.multiPlayer
                        },
                        {
                            type: "text",
                            style: {
                                fontSize: 16,
                                fontWeight: "w900"
                            },
                            value: finished + " " + result + " in " + playerMode + " !"
                        }]
                    },
                    {
                        type: "flex",
                        spacing: 16,
                        mainAxisAlignment: "spaceBetween",
                        fillParent: true,
                        children: [{
                            type: "text",
                            value: descriptionText
                        },
                        {
                            type: "text",
                            value: (difficulty == 0) ? 'Easy' : ((difficulty == 1) ? 'Medium' : 'Hard')
                        }]
                    }
                ]
            }
        },
        onPressed: {
            action: "pushState",
            props: {
                page: "game",
                game: props.game._id,
                player: currentPlayer._id
            }
        }
    };
}

function filterButton(players, props) {
    return {
        type: "actionable",
        onPressed: {
            action: "applyFilter",
            props: {
                buttonType: props.buttonType,
                value: props.buttonValue
            }
        },
        child: {
            type: "container",
            decoration: {
                color: 0xFF212121
            },
            child: {
                type: "flex",
                children: [
                    {
                        type: "container",
                        padding: ui.padding.all(8),
                        child: {
                            type: "text",
                            value: props.buttonText,
                            style: {
                                color: 0xFFFFFFFF
                            }
                        }
                    },
                ]
            }
        }
    }
}



module.exports = {
    gameList,
    gameCard,
    filterButton
}