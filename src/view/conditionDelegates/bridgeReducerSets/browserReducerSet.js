import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.set('browsers', List(action.payload.config.browsers));
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    browsers: state.get('browsers').toJS()
  };
};

export default {
  configToState,
  stateToConfig
};
