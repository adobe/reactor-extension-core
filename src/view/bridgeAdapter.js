'use strict';
import { actionCreators } from './actions/common/bridgeAdapterActions';

export let bridgeAdapterReducer = null;
export let setBridgeAdapterReducer = (nextState) => {
  bridgeAdapterReducer = nextState.routes[0].reducer;

  // Initialize assuming we're creating a new config.
  extensionBridge.setConfig();
};

export default (extensionBridge, store) => {
  extensionBridge.getConfig = () => {
    return bridgeAdapterReducer.stateToConfig({}, store.getState());
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
};
