export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    acceptsCookies: state.get('acceptsCookies')
  };
};

export default {
  configToState,
  stateToConfig
};
