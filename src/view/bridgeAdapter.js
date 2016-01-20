'use strict';
import { actionCreators } from './actions/bridgeAdapterActions';
import { handleSubmit } from './extensionViewReduxForm';
import { getValues, reset } from 'redux-form';
import reduceReducers from 'reduce-reducers';

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

export default (extensionBridge, store) => {
  let _reducersForRoute;

  extensionBridge.init = (options = {}) => {
    options = {
      ...options,
      config: options.config || {},
      configIsNew: !options.config
    };

    const initialValues = _reducersForRoute.configToFormValues({}, options);

    store.dispatch(actionCreators.init({
      propertyConfig: options.propertyConfig,
      initialValues
    }));

    store.dispatch(reset());
  };

  extensionBridge.getConfig = () => {
    const values = getValues(store.getState().form.default) || {};
    return _reducersForRoute.formValuesToConfig({}, values);
  };

  extensionBridge.validate = () => {
    let valid = false;
    // handleSubmit comes from redux-form. The function passed in will only be called if the
    // form passes validation.
    handleSubmit(() => valid = true)();
    return valid;
  };

  return (reducersForRoute = {}) => {
    const configToFormValuesReducers = [ configToFormValuesBaseReducer ];

    if (reducersForRoute.configToFormValues) {
      configToFormValuesReducers.push(reducersForRoute.configToFormValues);
    }

    const formValuesToConfigReducers = [ formValuesToConfigBaseReducer ];

    if (reducersForRoute.formValuesToConfig) {
      formValuesToConfigReducers.push(reducersForRoute.formValuesToConfig);
    }

    _reducersForRoute = {
      configToFormValues: reduceReducers(...configToFormValuesReducers),
      formValuesToConfig: reduceReducers(...formValuesToConfigReducers)
    };
  }
};
