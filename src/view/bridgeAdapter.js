'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionReduxForm';
import { getValues } from 'redux-form';
import reduceReducers from 'reduce-reducers';

export let bridgeAdapterReducers = null;

/**
 * Assigns everything inside config to values.
 */
const toValuesBaseReducer = (values, options) => {
  const { config } = options;
  return {
    ...values,
    ...config
  };
};

/**
 * Assigns everything inside values to config.
 */
const toConfigBaseReducer = (config, values) => {
  return {
    ...config,
    ...values
  };
};

export let setBridgeAdapterReducers = (nextState) => {
  const reducersFromRoute = nextState.routes[0].reducers || {};

  const toValuesReducers = [ toValuesBaseReducer ];

  if (reducersFromRoute.toValues) {
    toValuesReducers.push(reducersFromRoute.toValues);
  }

  const toConfigReducers = [ toConfigBaseReducer ];

  if (reducersFromRoute.toConfig) {
    toConfigReducers.push(reducersFromRoute.toConfig);
  }

  bridgeAdapterReducers = {
    toValues: reduceReducers.apply(null, toValuesReducers),
    toConfig: reduceReducers.apply(null, toConfigReducers)
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
    return bridgeAdapterReducers.toConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };
};
