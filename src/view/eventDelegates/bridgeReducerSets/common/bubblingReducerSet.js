export let configToState = (state, action) => {
  let { config, isNewConfig } = action.payload;
  return state.withMutations(state => {
    state.set('bubbleFireIfParent', Boolean(isNewConfig || config.bubbleFireIfParent));
    state.set('bubbleFireIfChildFired', Boolean(isNewConfig || config.bubbleFireIfChildFired));
    state.set('bubbleStop', Boolean(config.bubbleStop));
  });
};

export let stateToConfig = (config, state) => {
  if (state.get('bubbleFireIfParent')) {
    config.bubbleFireIfParent = true;
  }

  if (state.get('bubbleFireIfChildFired')) {
    config.bubbleFireIfChildFired = true;
  }

  if (state.get('bubbleStop')) {
    config.bubbleStop = true;
  }

  return config;
};

export default {
  configToState,
  stateToConfig
};
