export let configToState = (state, action) => {
  let { config } = action.payload;
  return state.set('name', config.name || '');
};

export let stateToConfig = (config, state) => {
  config.name = state.get('name');
  return config;
};

export let validate = state => {
  let nameInvalid = !state.get('name').length;
  return state.setIn(['errors', 'nameInvalid'], nameInvalid);
};

export default {
  configToState,
  stateToConfig,
  validate
};
