export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    script: state.get('script'),
    // Important. This is to let the library emitter know that it should convert our
    // script string to an actual function.
    __rawScripts: ['script']
  };
};

export default {
  configToState,
  stateToConfig
};
