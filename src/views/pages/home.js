import { collection } from '../../services/gameService.js';
import { collection as _collection } from '../../services/filterService.js';
import { flag } from '../utils/icons.js';

/**
 * @param {*} _data
 * @param {*} props
 * @returns
 */
export function content(_data, _props) {
    return {
        type: "container",
        constraints: {
            maxWidth: 600
        },
        child: {
            type: "view",
            name: "home_filters",
            coll: _collection,
            query: {
                user: "@me"
            }
        }
    }
}

export function filters(filters, _props) {
    const filter = filters[0] || {};
    // TODO: Display filters
    // TODO: filter the query with the filters
    return {
        type: "view",
        name: "gameList",
        coll: collection,
        query: {
            users: "@me",
            // Not available for now
            // finished: {
            //     $not: {
            //         $eq: true
            //     }
            // }
        }
    }
}

/**
 * @param {*} _data
 * @param {*} props
 * @returns
 */
export function menu(_data, _props) {
    return {
        type: "view",
        name: "menu",
        props: {
            mainAction: {
                text: "New game",
                onPressed: {
                    action: "pushState",
                    props: {
                        page: "newGame"
                    }
                }
            }
        }
    }
}
