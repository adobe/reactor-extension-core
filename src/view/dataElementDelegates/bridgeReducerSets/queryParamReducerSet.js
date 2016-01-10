export let configToState = (state, action) => {
  return state.withMutations(state => {
    state.set('name', action.payload.config.name);
    state.set('caseInsensitive',
      action.payload.isNewConfig || action.payload.config.caseInsensitive);
  });
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    name: state.get('name'),
    caseInsensitive: state.get('caseInsensitive')
  };
};

export let validate = state => {
  return state.setIn(['errors', 'nameIsEmpty'], !state.get('name'));
};

export default {
  configToState,
  stateToConfig,
  validate
};
