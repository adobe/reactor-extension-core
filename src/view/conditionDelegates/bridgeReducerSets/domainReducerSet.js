import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.withMutations(state => {
    state.set('availableDomains', List(action.payload.propertyConfig.domainList));
    state.set('selectedDomains', List(action.payload.config.domains));
  });
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    domains: state.get('selectedDomains').toJS()
  };
};

export default {
  configToState,
  stateToConfig
};
