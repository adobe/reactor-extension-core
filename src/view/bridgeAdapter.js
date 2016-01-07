'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';

export let bridgeAdapterReducer = null;
export let setBridgeAdapterReducer = (nextState) => {
  bridgeAdapterReducer = nextState.routes[0].reducer;
};

export default (extensionBridge, store) => {
  extensionBridge.init = options => {
    store.dispatch(actionCreators.setConfig({
      ...options,
      config: options.config || {},
      isNewConfig: !options.config
    }));
  };

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

  extensionBridge.validate = () => {
    store.dispatch(actionCreators.validate());
    let errors = store.getState().get('errors');
    return !errors || !errors.some(value => value);
  };
};
