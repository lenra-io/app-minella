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
    var startTimeAsc = (filters.startTime == "Asc");
    var playTimeAsc = (filters.playTime == "Asc");
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
            "Winned": true,
            "Loosed": false
        }
        if (filters.gameState == "Winned") {
            resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner == undefined));
        } else {
            resultFilter = gameStateFilter.filter(game => resultDir[filters.result] == (game.winner != undefined));
        }
    }
    // var startTimeFilter = resultFilter;
    // if (startTimeAsc) {
    //     startTimeFilter = resultFilter.sort((a, b) => b.lastMoveDate - a.lastMoveDate);
    // } else {
    //     startTimeFilter = resultFilter.sort((a, b) => a.lastMoveDate - b.lastMoveDate);
    // }
    var playTimeFilter = resultFilter;
    if (playTimeAsc) {
        playTimeFilter = resultFilter.sort((a, b) => b.lastPlayDate - a.lastPlayDate);
    } else {
        playTimeFilter = resultFilter.sort((a, b) => a.lastPlayDate - b.lastPlayDate);
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
            // fillParent: props.fillParent,
            // crossAxisAlignment: props.crossAxisAlignment,
            padding: {
                bottom: 4
            },
            children: [
                {
                    type: "flex",
                    // direction: "vertical",
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
                                                    // buttons to place here
                                                    {
                                                        type: "button",
                                                        text: "Finished",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "gameState",
                                                                value: "Finished"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Not Finished",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "gameState",
                                                                value: "Not Finished"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Not Started",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "gameState",
                                                                value: "Not Started"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "All",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "gameState",
                                                                value: "All"
                                                            }
                                                        }
                                                    },
                                                ]
                                            },
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
                                                    // buttons to place here
                                                    {
                                                        type: "widget",
                                                        name: "filterButton",
                                                        props: {
                                                            buttonType: "difficulty",
                                                            buttonValue: "Easy",
                                                            buttonText: "Easy"
                                                        }
                                                    }, {
                                                        type: "button",
                                                        text: "Easy",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "difficulty",
                                                                value: "Easy"
                                                            }
                                                        }
                                                    },

                                                    {
                                                        type: "button",
                                                        text: "Medium",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "difficulty",
                                                                value: "Medium"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Hard",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "difficulty",
                                                                value: "Hard"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "All",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "difficulty",
                                                                value: "All"
                                                            }
                                                        }
                                                    },
                                                ]
                                            },
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
                                                    // buttons to place here
                                                    {
                                                        type: "button",
                                                        text: "Winned",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "result",
                                                                value: "Winned"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Loosed",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "result",
                                                                value: "Loosed"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "All",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "result",
                                                                value: "All"
                                                            }
                                                        }
                                                    },
                                                ]
                                            },
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
                                                    // buttons to place here
                                                    {
                                                        type: "button",
                                                        text: "Asc",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "playTime",
                                                                value: "Asc"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Desc",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "playTime",
                                                                value: "Desc"
                                                            }
                                                        }
                                                    },
                                                ]
                                            },
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
                                                    // buttons to place here
                                                    {
                                                        type: "button",
                                                        text: "Asc",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "startTime",
                                                                value: "Asc"
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: "button",
                                                        text: "Desc",
                                                        onPressed: {
                                                            action: "applyFilter",
                                                            props: {
                                                                buttonType: "startTime",
                                                                value: "Desc"
                                                            }
                                                        }
                                                    },
                                                ]
                                            },
                                        }
                                    ]
                                }
                            ]
                        },
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
    var finished = (props.game.finished) ? "Finished !" : "Continue game !";
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
    var descriptionText = (isNaN(date)) ? "Not started yet !" : "Last played on " + dateformat + ", in " + playerMode + "\n" + finished + " With " + getProperTime(duration.getHours()) + ":" + getProperTime(duration.getMinutes()) + ":" + getProperTime(duration.getSeconds()) + " of play time.";
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
                            value: (difficulty == 0) ? 'Easy' : ((difficulty == 1) ? 'Medium' : 'Hard')
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


/**
 * 
 * @param {Player[]} players 
 * @param {{game: Game}} props
 * @returns 
 */
function filterButton(props) {
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
                    // {
                    //     type: "icon",
                    //     value: props.icon,
                    //     color: 0xFFFFFFFF,
                    //     size: 25
                    // },
                    {
                        type: "container",
                        padding: {
                            top: 1,
                            left: 1,
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