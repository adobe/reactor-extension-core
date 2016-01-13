'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues } from 'redux-form';
import reduceReducers from 'reduce-reducers';

export let bridgeAdapterReducers = null;

/**
 * Assigns everything inside config to state.
 */
const configToFormValuesBaseReducer = (values, options) => {
  const { config } = options;
  return {
    ...values,
    ...config
  };
};

/**
 * Assigns everything inside state to config.
 */
const formValuesToConfigBaseReducer = (config, values) => {
  return {
    ...config,
    ...values
  };
};

export let setBridgeAdapterReducers = (nextState) => {
  const reducersFromRoute = nextState.routes[0].reducers || {};

  const configToFormValuesReducers = [ configToFormValuesBaseReducer ];

  if (reducersFromRoute.configToFormValues) {
    configToFormValuesReducers.push(reducersFromRoute.configToFormValues);
  }

  const formValuesToConfigReducers = [ formValuesToConfigBaseReducer ];

  if (reducersFromRoute.formValuesToConfig) {
    formValuesToConfigReducers.push(reducersFromRoute.formValuesToConfig);
  }

  bridgeAdapterReducers = {
    configToFormValues: reduceReducers(...configToFormValuesReducers),
    formValuesToConfig: reduceReducers(...formValuesToConfigReducers)
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
    return bridgeAdapterReducers.formValuesToConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };
};
