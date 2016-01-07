import { configToState, stateToConfig, validate } from '../cartAmountReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('cart amount reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          dataElementName: 'foo',
          operator: '<',
          amount: 123
        }
      }));

      expect(state.toJS()).toEqual({
        dataElementName: 'foo',
        operator: '<',
        amount: 123
      });
    });

    it('sets a default operator', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {}
      }));

      expect(state.toJS()).toEqual({
        operator: '>'
      });
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        dataElementName: 'foo',
        operator: '<',
        amount: 123
      }));

      expect(config).toEqual({
        dataElementName: 'foo',
        operator: '<',
        amount: 123
      });
    });
  });

  describe('validate', () => {
    it('fails if the data elemnt name is empty', () => {
      let state = validate(fromJS({
        dataElementName: ''
      }));

      expect(state.getIn(['errors', 'dataElementNameIsEmpty'])).toBe(true);
    });

    it('fails if the amount is empty', () => {
      let state = validate(fromJS({
        amount: ''
      }));

      expect(state.getIn(['errors', 'amountIsEmpty'])).toBe(true);
    });

    it('fails if the amount is not a number', () => {
      let state = validate(fromJS({
        amount: 'asdf'
      }));

      expect(state.getIn(['errors', 'amountIsNaN'])).toBe(true);
    });
  });
});
