export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  config.acceptsCookies = state.get('acceptsCookies');
  return config;
};

export default {
  configToState,
  stateToConfig
};
