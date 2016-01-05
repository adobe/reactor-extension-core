'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';

export let bridgeAdapterReducer = null;
export let setBridgeAdapterReducer = (nextState) => {
  bridgeAdapterReducer = nextState.routes[0].reducer;

  // Initialize assuming we're creating a new config.
  extensionBridge.setConfig();
};

export default (extensionBridge, store) => {
  extensionBridge.getConfig = () => {
    let config = {};

    if (bridgeAdapterReducer.stateToConfig) {
      let reducedConfig = bridgeAdapterReducer.stateToConfig(config, store.getState());

      if (config === reducedConfig) {
        throw new Error('Bridge adapter reducer stateToConfig must return a new config object.');
      }

      config = reducedConfig;
    }

    return config;
  };

  extensionBridge.setConfig = config => {
    store.dispatch(actionCreators.setConfig({
      config: config || {},
      isNewConfig: config === undefined
    }));
  };

  extensionBridge.validate = () => {
    store.dispatch(actionCreators.validate());
    let errors = store.getState().get('errors');
    return !errors || !errors.some(value => value);
  };
};
