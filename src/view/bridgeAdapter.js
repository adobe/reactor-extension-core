'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues } from 'redux-form';
import reduceReducers from 'reduce-reducers';

export let bridgeAdapterReducers = null;

/**
 * Assigns everything inside config to state.
 */
const configToStateBaseReducer = (values, options) => {
  const { config } = options;
  return {
    ...values,
    ...config
  };
};

/**
 * Assigns everything inside state to config.
 */
const stateToConfigReducer = (config, values) => {
  return {
    ...config,
    ...values
  };
};

export let setBridgeAdapterReducers = (nextState) => {
  const reducersFromRoute = nextState.routes[0].reducers || {};

  const configToStateReducers = [ configToStateBaseReducer ];

  if (reducersFromRoute.configToState) {
    configToStateReducers.push(reducersFromRoute.configToState);
  }

  const stateToConfigReducers = [ stateToConfigReducer ];

  if (reducersFromRoute.stateToConfig) {
    stateToConfigReducers.push(reducersFromRoute.stateToConfig);
  }

  bridgeAdapterReducers = {
    configToState: reduceReducers.apply(null, configToStateReducers),
    stateToConfig: reduceReducers.apply(null, stateToConfigReducers)
  };
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
    const values = getValues(store.getState().form.default);
    return bridgeAdapterReducers.stateToConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };
};
