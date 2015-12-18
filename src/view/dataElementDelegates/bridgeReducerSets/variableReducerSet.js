export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  config.path = state.get('path');
  return config;
};

export let validate = state => {
  return state.setIn(['errors', 'pathInvalid'], !state.get('path'));
};

export default {
  configToState,
  stateToConfig,
  validate
};
