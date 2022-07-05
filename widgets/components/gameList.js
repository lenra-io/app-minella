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
    var filters = props.userData.filters;
    var startTimeNone = (filters.startTime == "None");
    var playTimeNone = (filters.playTime == "None");
    var difficultyAll = (filters.difficulty == "All");
    var gameStateAll = (filters.gameState == "All");
    var resultAll = (filters.result == "All");
    var difficultyFilter = games;
    if (!difficultyAll) {
        var difficultDir = {
            0: "Easy",
            1: "Medium",
            2: "Hard",
        }
        difficultyFilter = games.filter(game => difficultDir[game.difficulty] == filters.difficulty);
    }

    var gameStateFilter = difficultyFilter;
    if (!gameStateAll) {
        var gameStateDir = {
            "Finished": true,
            "Not Finished": undefined,
            "Not Started": undefined,
        }
        if (filters.gameState == "Finished") {
            gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished);
        } else if (filters.gameState == "Not Started") {
            gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished && game.lastPlayDate == undefined);
        } else {
            gameStateFilter = difficultyFilter.filter(game => gameStateDir[filters.gameState] == game.finished && game.lastPlayDate != undefined);
        }
    }

    var resultFilter = gameStateFilter;
    if (!resultAll) {
        var resultDir = {
            "Won": true,
            "Lost": false
        }
        if (filters.gameState == "Won") {
            resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner == undefined));
        } else {
            resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner != undefined) && game.finished);
        }
    }

    var startTimeFilter = resultFilter;
    if (!startTimeNone) {
        startTimeFilter = (filters.startTime == "Asc") ? resultFilter.sort((a, b) => a.startPlayDate - b.startPlayDate) : resultFilter.sort((a, b) => b.startPlayDate - a.startPlayDate);
    }

    var playTimeFilter = startTimeFilter;
    if (!playTimeNone) {
        playTimeFilter = (filters.playTime == "Asc") ? startTimeFilter.sort((a, b) => (a.lastPlayDate - a.startPlayDate) - (b.lastPlayDate - b.startPlayDate)) : startTimeFilter.sort((a, b) => (b.lastPlayDate - b.startPlayDate) - (a.lastPlayDate - a.startPlayDate));
    }
    return {
        type: "container",
        constraints: {
            maxWidth: 600
        },
        child: {
            type: "flex",
            spacing: 3,
            direction: "vertical",
            padding: {
                bottom: 4
            },
            children: [
                {
                    type: "flex",
                    fillParent: true,
                    mainAxisAlignment: "spaceBetween",
                    children: [
                        {
                            type: "flex",
                            direction: "vertical",
                            children: [
                                {
                                    type: "text",
                                    value: "Game state :"
                                },
                                {
                                    type: "flex",
                                    children: [
                                        {
                                            type: "dropdownButton",
                                            text: filters.gameState,
                                            child: {
                                                type: "menu",
                                                children: [
                                                    {
                                                        type: "flex",
                                                        direction: "vertical",
                                                        crossAxisAlignment: "stretch",
                                                        children: [
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "gameState",
                                                                    buttonValue: "Finished",
                                                                    buttonText: "Finished"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "gameState",
                                                                    buttonValue: "Not Started",
                                                                    buttonText: "Not Started"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "gameState",
                                                                    buttonValue: "Not Finished",
                                                                    buttonText: "Not Finished"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "gameState",
                                                                    buttonValue: "All",
                                                                    buttonText: "All"
                                                                }
                                                            },
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "flex",
                            direction: "vertical",
                            children: [
                                {
                                    type: "text",
                                    value: "Difficulty :"
                                },
                                {
                                    type: "flex",
                                    children: [
                                        {
                                            type: "dropdownButton",
                                            text: filters.difficulty,
                                            child: {
                                                type: "menu",
                                                children: [
                                                    {
                                                        type: "flex",
                                                        direction: "vertical",
                                                        crossAxisAlignment: "stretch",
                                                        children: [
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "difficulty",
                                                                    buttonValue: "Easy",
                                                                    buttonText: "Easy"
                                                                }
                                                            }
                                                            , {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "difficulty",
                                                                    buttonValue: "Medium",
                                                                    buttonText: "Medium"
                                                                }
                                                            }
                                                            , {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "difficulty",
                                                                    buttonValue: "Hard",
                                                                    buttonText: "Hard"
                                                                }
                                                            }
                                                            , {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "difficulty",
                                                                    buttonValue: "All",
                                                                    buttonText: "All"
                                                                }
                                                            }
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "flex",
                            direction: "vertical",
                            children: [
                                {
                                    type: "text",
                                    value: "Result :"
                                },
                                {
                                    type: "flex",
                                    children: [
                                        {
                                            type: "dropdownButton",
                                            text: filters.result,
                                            child: {
                                                type: "menu",
                                                children: [
                                                    {
                                                        type: "flex",
                                                        direction: "vertical",
                                                        crossAxisAlignment: "stretch",
                                                        children: [
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "result",
                                                                    buttonValue: "Won",
                                                                    buttonText: "Won"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "result",
                                                                    buttonValue: "Lost",
                                                                    buttonText: "Lost"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "result",
                                                                    buttonValue: "All",
                                                                    buttonText: "All"
                                                                }
                                                            },
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "flex",
                            direction: "vertical",
                            children: [
                                {
                                    type: "text",
                                    value: "Play Time :"
                                },
                                {
                                    type: "flex",
                                    children: [
                                        {
                                            type: "dropdownButton",
                                            text: filters.playTime,
                                            child: {
                                                type: "menu",
                                                children: [
                                                    {
                                                        type: "flex",
                                                        direction: "vertical",
                                                        crossAxisAlignment: "stretch",
                                                        children: [
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "playTime",
                                                                    buttonValue: "Asc",
                                                                    buttonText: "Asc"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "playTime",
                                                                    buttonValue: "Desc",
                                                                    buttonText: "Desc"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "playTime",
                                                                    buttonValue: "None",
                                                                    buttonText: "None"
                                                                }
                                                            },
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "flex",
                            direction: "vertical",
                            children: [
                                {
                                    type: "text",
                                    value: "Start Time :"
                                },
                                {
                                    type: "flex",
                                    children: [
                                        {
                                            type: "dropdownButton",
                                            text: filters.startTime,
                                            child: {
                                                type: "menu",
                                                children: [
                                                    {
                                                        type: "flex",
                                                        direction: "vertical",
                                                        crossAxisAlignment: "stretch",
                                                        children: [
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "startTime",
                                                                    buttonValue: "Asc",
                                                                    buttonText: "Asc"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "startTime",
                                                                    buttonValue: "Desc",
                                                                    buttonText: "Desc"
                                                                }
                                                            },
                                                            {
                                                                type: "widget",
                                                                name: "filterButton",
                                                                props: {
                                                                    buttonType: "startTime",
                                                                    buttonValue: "None",
                                                                    buttonText: "None"
                                                                }
                                                            },
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "button",
                            text: "Reset filters",
                            onPressed: {
                                action:"resetFilters"
                            }
                        }
                    ]
                }
                , ...playTimeFilter
                    .map(game => {
                        return {
                            type: "widget",
                            name: "gameCard",
                            query: {
                                "$find": {
                                    "_datastore": playerService.datastoreName,
                                    "_refs": {
                                        "$and": [
                                            {
                                                "$contains": game._id
                                            },
                                            {
                                                "$contains": "@me"
                                            }
                                        ]
                                    }
                                }
                            },
                            props: {
                                game
                            }
                        }
                    })
            ]
        }
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
                spacing: 2,
                mainAxisAlignment: "spaceEvenly",
                direction: "vertical",
                padding: {
                    left: 2,
                    right: 2
                },
                children: [
                    {
                        type: "flex",
                        spacing: 2,
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
                        spacing: 2,
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
                        padding: {
                            top: 1,
                            left: 1,
                            right: 1,
                            bottom: 1,
                        },
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