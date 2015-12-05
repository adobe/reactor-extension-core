'use strict';
import Bacon from 'baconjs';
import { getState } from './store';
import actions from './actions/bridgeAdapterActions';
import Immutable from 'immutable';
import createID from './utils/createID';
import clickReducerSet from './bridgeReducerSets/clickReducerSet';

let getConfig = () => {
  return clickReducerSet.stateToConfig({}, getState());
};

let setConfig = config => {
  actions.config.push({
    config: config || {},
    isNewConfig: config === undefined,
    reducer: clickReducerSet.configToState
  });
};

let validate = () => {
  actions.validate.push({
    reducer: clickReducerSet.validate
  });

  return !getState().get('errors').some(value => value);
};

// Initialize assuming we're creating a new config.
setConfig();

export default (extensionBridge) => {
  extensionBridge.getConfig = getConfig;
  extensionBridge.setConfig = setConfig;
  extensionBridge.validate = validate;
};
