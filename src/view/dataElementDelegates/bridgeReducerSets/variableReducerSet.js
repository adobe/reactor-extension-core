export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    path: state.get('path')
  };
};

export let validate = state => {
  return state.setIn(['errors', 'pathIsEmpty'], !state.get('path'));
};

export default {
  configToState,
  stateToConfig,
  validate
};
