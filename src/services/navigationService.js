'use strict'

import Navigation from '../classes/Navigation.js';
import { executeQuery, createDoc, updateDoc } from './lenraDocumentService.js';
const homeNavigation = {
    state: {
        page: 'home'
    },
    history: []
};
export const collection = 'navigations';

export async function getNavigation(api) {
    const navs = await api.data.find(Navigation, {
        user: "@me"
    });
    return navs[0];
}


export async function home(api) {
    let navigation = await getNavigation(api);
    if (!navigation) {
        console.log("create navigation");
        navigation = new Navigation()
        navigation.user = "@me";
        navigation.state = Object.assign({}, homeNavigation.state);
        navigation.history = Object.assign([], homeNavigation.history);

        return api.data.createDoc(navigation);
    }else {
        navigation = { ...navigation, ...homeNavigation };
        return api.data.updateDoc(navigation);
    }
}
export async function updateState(api, navigation, stateData) {
    navigation = navigation || await getNavigation(api);
    Object.entries(stateData)
        .forEach(([key, value]) => {
            navigation.state[key] = value;
        });
    return api.data.updateDoc(navigation);
}
export async function pushState(api, navigation, state) {
    navigation = navigation || await getNavigation(api);
    navigation.history.push(navigation.state);
    navigation.state = {
        ...state
    };
    return api.data.updateDoc(navigation);
}
export async function popState(api, navigation, times) {
    navigation = navigation || await getNavigation(api);
    // TODO: manage editing category
    times = Math.max(1, Math.min(navigation.history.length, times || 1));
    while (times-- > 0)
        navigation.state = navigation.history.pop();
    return api.data.updateDoc(navigation);
}
