import Bacon from 'baconjs';
import {stateUpdate} from './store';
import {List, Map} from 'immutable';
import createID from './utils/createID';

let replaceState = new Bacon.Bus();

stateUpdate.plug(replaceState.map((state) => {
  return () => {
    return state;
  };
}));

let setShowElementFilterFields = new Bacon.Bus();

stateUpdate.plug(setShowElementFilterFields.map((showElementFilterFields) => {
  return (state) => {
    return state.set('showElementFilterFields', showElementFilterFields);
  };
}));

let setConfigParts = new Bacon.Bus();

stateUpdate.plug(setConfigParts.map((configParts) => {
  return (state) => {
    return state.withMutations((state) => {
      Object.keys(configParts).forEach((path) => {
        var pathSegments = path.split('.');
        pathSegments.unshift('config');
        state.setIn(pathSegments, configParts[path]);
      });
    });
  };
}));

let deleteConfigParts = new Bacon.Bus();

stateUpdate.plug(deleteConfigParts.map((configParts) => {
  return (state) => {
    return state.withMutations((state) => {
      configParts.forEach((path) => {
        var pathSegments = path.split('.');
        pathSegments.unshift('config');
        state.deleteIn(pathSegments);
      });
    });
  };
}));

export default {
  replaceState,
  setConfigParts,
  deleteConfigParts,
  setShowElementFilterFields
};
