import { home as _home, pushState as _pushState, popState as _popState, updateState } from '../services/navigationService.js';

function home(props, event, api) {
    return _home(api);
}

function setPage(props, event, api) {
    return _pushState(api, null, {page: props.page});
}

function pushState(props, event, api) {
    return _pushState(api, null, props);
}

function popState(props, event, api) {
    return _popState(api, null, props.times);
}

function setStateProperty(props, event, api) {
    return updateState(api, null, {[props.property]: event.value || props.value});
}

function openModal(props, event, api) {
    return updateState(api, null, {modal: props.modal});
}

function closeModal(props, event, api) {
    return updateState(api, null, {modal: undefined});
}

export default {
    home,
    setPage,
    pushState,
    popState,
    setStateProperty,
    openModal,
    closeModal
}
