'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionReduxForm';
import { getValues } from 'redux-form';

export let bridgeAdapterReducers = null;
export let setBridgeAdapterReducers = (nextState) => {
  bridgeAdapterReducers = nextState.routes[0].reducers;
};

export default (extensionBridge, store) => {
  extensionBridge.init = options => {
    store.dispatch(actionCreators.setConfig({
      ...options,
      config: options.config || {},
      configIsNew: !options.config
    }));
  };

  extensionBridge.getConfig = () => {
    let config = {};

    if (bridgeAdapterReducers.toConfig) {
      const values = getValues(store.getState().form.default);
      config = bridgeAdapterReducers.toConfig(config, values);
    }

    return config;
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };
};
