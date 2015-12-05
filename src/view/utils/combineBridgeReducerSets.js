import combineReducers from './combineReducers';

export default (...reducerSets) => {
  let configToStateReducers = [];
  let stateToConfigReducers = [];
  let validateReducers = [];

  reducerSets.forEach(reducerSet => {
    if (reducerSet.configToState) {
      configToStateReducers.push(reducerSet.configToState);
    }

    if (reducerSet.stateToConfig) {
      stateToConfigReducers.push(reducerSet.stateToConfig);
    }

    if (reducerSet.validate) {
      validateReducers.push(reducerSet.validate);
    }
  });

  return {
    configToState: combineReducers.apply(null, configToStateReducers),
    stateToConfig: combineReducers.apply(null, stateToConfigReducers),
    validate: combineReducers.apply(null, validateReducers)
  };
};
