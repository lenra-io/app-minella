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
            children: games
                .sort((a, b) => b.lastMoveDate - a.lastMoveDate)
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
        }
    };
}

/**
 * 
 * @param {Player[]} players 
 * @param {{game: Game}} props
 * @returns 
 */
function gameCard(players, props) {
    console.log("__________________PROPS_________________")
    console.log(props)
    const currentPlayer = players[0];
    var difficulty = props.game.difficulty;
    var finished = (props.game.finished) ? "Finished !" : "Continue game !";
    var date = new Date(props.game.lastPlayDate);
    var dateformat = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    var numberOfPlayer = props.game.playerNumber;
    var playerMode = (numberOfPlayer == 1) ? "solo mode" : "multiplayer mode";
    var descriptionText = (isNaN(date)) ? "Not started yet !" : "Last played on " + dateformat + ", in " + playerMode + "\n" + finished;

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

module.exports = {
    gameList,
    gameCard
}