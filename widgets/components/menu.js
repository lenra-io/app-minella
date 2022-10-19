const navigationService = require('../../services/navigationService.js');
const ui = require('../utils/ui.js')

function menu(data, props) {
    const children = [{
        type: "widget",
        name: "ariane",
        coll: navigationService.collection,
        query: {
            user: "@me"
        }
    }];
    if (props && props.mainAction) {
        children.push({
            ...props.mainAction,
            type: "button"
        });
    }
    return {
        type: "container",
        decoration: {
            color: 0xFFFFFFFF,
            boxShadow: {
                blurRadius: 8,
                color: 0x1A000000,
                offset: {
                    dx: 0,
                    dy: 1
                }
            },
        },
        child: {
            type: "flex",
            fillParent: true,
            mainAxisAlignment: "spaceBetween",
            crossAxisAlignment: "center",
            padding: ui.padding.symmetric(32, 16),
            children
        }
    }
}

/**
 * @param {Navigation[]} navs
 * @param {*} _props 
 * @returns 
 */
function ariane(navs, _props) {
    const navigation = navs[0];
    return {
        type: "flex",
        crossAxisAlignment: "center",
        children: [
            ...navigation.history.flatMap((state, i) => {
                return [
                    fillWidgetPageName(state, {
                        type: "button",
                        mainStyle: "tertiary",
                        onPressed: {
                            action: "popState",
                            props: {
                                times: navigation.history.length - i
                            }
                        }
                    }),
                    {
                        type: "text",
                        value: "/",
                    }
                ]
            }),
            fillWidgetPageName(navigation.state, {
                type: "container",
                padding: ui.padding.symmetric(16, 8),
                child: {
                    type: "text"
                }
            })
        ]
    };
}

/**
 * @param {*} state 
 * @param {*} widget 
 * @returns 
 */
function fillWidgetPageName(state, widget) {
    switch (state.page) {
        case 'home':
            return fillWidgetText(widget, 'Minella');
        case 'game':
            return fillWidgetText(widget, 'Game');
        case 'newGame':
            return fillWidgetText(widget, 'New game');
        default:
            console.error(`Not managed page ${state.page}`);
            return fillWidgetText(widget, state.page);
    }
}

/**
 * @param {*} widget
 * @param {string} text 
 * @returns 
 */
function fillWidgetText(widget, text) {
    switch (widget.type) {
        case "container":
            widget = { ...widget, child: fillWidgetText(widget.child, text) };
            break;
        case "text":
            widget = { ...widget, value: text };
            break;
        case "button":
            widget = { ...widget, text };
            break;
        default:
            console.error(`Not managed widget type ${widget.type}`);
    }
    return widget;
}

module.exports = {
    menu,
    ariane
}