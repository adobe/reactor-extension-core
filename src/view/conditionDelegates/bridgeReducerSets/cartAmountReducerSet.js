import { List } from 'immutable';

export let configToState = (state, action) => {
  state = state.merge(action.payload.config);

  if (!state.get('operator')) {
    state = state.set('operator', '>');
  }

  return state;
};

export let stateToConfig = (config, state) => {
  return {
    ...config,
    dataElementName: state.get('dataElementName'),
    operator: state.get('operator'),
    amount: Number(state.get('amount'))
  };
};

export let validate = state => {
  return state.withMutations(state => {
    state.setIn(['errors', 'dataElementNameIsEmpty'], !state.get('dataElementName'));
    state.setIn(['errors', 'amountIsEmpty'], !state.get('amount'));
    state.setIn(['errors', 'amountIsNaN'], isNaN(state.get('amount')));
  });
};

export default {
  configToState,
  stateToConfig,
  validate
};
