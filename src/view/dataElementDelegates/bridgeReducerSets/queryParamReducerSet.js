export let configToState = (state, action) => {
  return state.withMutations(state => {
    state.set('name', action.payload.config.name);
    state.set('caseInsensitive',
      action.payload.isNewConfig || action.payload.config.caseInsensitive);
  });
};

export let stateToConfig = (config, state) => {
  config.name = state.get('name');
  config.caseInsensitive = state.get('caseInsensitive');
  return config;
};

export let validate = state => {
  return state.setIn(['errors', 'nameInvalid'], !state.get('name'));
};

export default {
  configToState,
  stateToConfig,
  validate
};
