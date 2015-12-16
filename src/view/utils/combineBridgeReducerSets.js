import reduceReducers from 'reduce-reducers';

/**
 * Given multiple reducer sets, returns a combined reducer set that, when called, executes the
 * corresponding method of all the child reducer sets.
 * @param {...Object} reducerSets
 * @returns {{configToState: Function, stateToConfig: Function, validate: Function}}
 */
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
    configToState: reduceReducers.apply(null, configToStateReducers),
    stateToConfig: reduceReducers.apply(null, stateToConfigReducers),
    validate: reduceReducers.apply(null, validateReducers)
  };
};
