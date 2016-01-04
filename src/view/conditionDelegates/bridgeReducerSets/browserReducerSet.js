import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.set('browsers', List(action.payload.config.browsers));
};

export let stateToConfig = (config, state) => {
  config.browsers = state.get('browsers').toJS();
  return config;
};

export default {
  configToState,
  stateToConfig
};
