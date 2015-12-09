let configToState = (state, action) => {
  return state.set('delayLinkActivation', Boolean(action.payload.config.delayLinkActivation));
};

let stateToConfig = (config, state) => {
  if (state.get('delayLinkActivation')) {
    config.delayLinkActivation = true;
  }

  return config;
};

export default {
  configToState,
  stateToConfig
};
