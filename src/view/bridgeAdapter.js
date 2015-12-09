'use strict';
import { setConfig, validate } from './actions/bridgeAdapterActions';
import clickReducerSet from './bridgeReducerSets/clickReducerSet';

export default (extensionBridge, store) => {
  extensionBridge.getConfig = () => {
    return clickReducerSet.stateToConfig({}, store.getState());
  };

  extensionBridge.setConfig = config => {
    store.dispatch(setConfig({
      config: config || {},
      isNewConfig: config === undefined
    }));
  };

  extensionBridge.validate = () => {
    store.dispatch(validate());
    return !store.getState().get('errors').some(value => value);
  };

  // Initialize assuming we're creating a new config.
  extensionBridge.setConfig();
};
