import { List } from 'immutable';

export let configToState = (state, action) => {
  return state.merge(action.payload.config);
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    name: state.get('name'),
    value: state.get('value'),
    valueIsRegex: state.get('valueIsRegex')
  };
};

export let validate = state => {
  return state.withMutations(state => {
    state.setIn(['errors', 'nameInvalid'], !state.get('name'));
    state.setIn(['errors', 'valueInvalid'], !state.get('value'));
  });
};

export default {
  configToState,
  stateToConfig,
  validate
};
