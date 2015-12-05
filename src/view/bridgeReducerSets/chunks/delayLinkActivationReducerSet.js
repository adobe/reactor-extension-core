let configToState = (state, config) => {
  return state.set('delayLinkActivation', Boolean(config.delayLinkActivation));
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
