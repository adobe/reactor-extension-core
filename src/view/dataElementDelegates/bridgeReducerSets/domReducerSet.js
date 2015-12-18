export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  config.elementSelector = state.get('elementSelector');
  config.elementProperty = state.get('elementProperty');
  return config;
};

export let validate = state => {
  return state.withMutations(state => {
    state.setIn(['errors', 'elementSelectorInvalid'], !state.get('elementSelector'));
    state.setIn(['errors', 'elementPropertyInvalid'], !state.get('elementProperty'));
  });
};

export default {
  configToState,
  stateToConfig,
  validate
};
