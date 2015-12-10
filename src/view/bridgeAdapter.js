'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import clickReducerSet from './bridgeReducerSets/clickReducerSet';

export default (extensionBridge, store) => {
  extensionBridge.getConfig = () => {
    return clickReducerSet.stateToConfig({}, store.getState());
  };

  extensionBridge.setConfig = config => {
    store.dispatch(actionCreators.setConfig({
      config: config || {},
      isNewConfig: config === undefined
    }));
  };

  extensionBridge.validate = () => {
    store.dispatch(actionCreators.validate());
    return !store.getState().get('errors').some(value => value);
  };

  // Initialize assuming we're creating a new config.
  extensionBridge.setConfig();
};
