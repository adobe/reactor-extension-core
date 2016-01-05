import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.set('deviceTypes', List(action.payload.config.deviceTypes));
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    deviceTypes: state.get('deviceTypes').toJS()
  };
};

export default {
  configToState,
  stateToConfig
};
