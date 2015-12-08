'use strict';
import store from './store';
import actions from './actions/bridgeAdapterActions';
import Immutable from 'immutable';
import createID from './utils/createID';
import clickReducerSet from './bridgeReducerSets/clickReducerSet';

let getConfig = () => {
  return clickReducerSet.stateToConfig({}, store.getValue());
};

let setConfig = config => {
  actions.config.onNext({
    config: config || {},
    isNewConfig: config === undefined,
    reducer: clickReducerSet.configToState
  });
};

let validate = () => {
  actions.validate.onNext({
    reducer: clickReducerSet.validate
  });

  return !store.getValue().get('errors').some(value => value);
};

// Initialize assuming we're creating a new config.
setConfig();

export default (extensionBridge) => {
  extensionBridge.getConfig = getConfig;
  extensionBridge.setConfig = setConfig;
  extensionBridge.validate = validate;
};
