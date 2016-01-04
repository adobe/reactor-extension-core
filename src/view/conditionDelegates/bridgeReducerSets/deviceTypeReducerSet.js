import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.set('deviceTypes', List(action.payload.config.deviceTypes));
};

export let stateToConfig = (config, state) => {
  config.deviceTypes = state.get('deviceTypes').toJS();
  return config;
};

export default {
  configToState,
  stateToConfig
};
