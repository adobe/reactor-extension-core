import { configToState, stateToConfig, validate } from '../domReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('dom reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          elementSelector: 'foo',
          elementProperty: 'innerHTML'
        }
      }));

      expect(state.toJS()).toEqual({
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      });
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      }));

      expect(config).toEqual({
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      });
    });
  });

  describe('validate', () => {
    it('fails if values are empty', () => {
      let state = validate(fromJS({
        elementSelector: '',
        elementProperty: ''
      }));

      expect(state.getIn(['errors', 'elementSelectorInvalid'])).toBe(true);
      expect(state.getIn(['errors', 'elementPropertyInvalid'])).toBe(true);
    });
  })

});
