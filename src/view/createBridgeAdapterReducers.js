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

export default (reducersFromRoute = {}) => {

  const configToFormValuesReducers = [ configToFormValuesBaseReducer ];

  if (reducersFromRoute.configToFormValues) {
    configToFormValuesReducers.push(reducersFromRoute.configToFormValues);
  }

  const formValuesToConfigReducers = [ formValuesToConfigBaseReducer ];

  if (reducersFromRoute.formValuesToConfig) {
    formValuesToConfigReducers.push(reducersFromRoute.formValuesToConfig);
  }

  return {
    configToFormValues: reduceReducers(...configToFormValuesReducers),
    formValuesToConfig: reduceReducers(...formValuesToConfigReducers)
  };
};
