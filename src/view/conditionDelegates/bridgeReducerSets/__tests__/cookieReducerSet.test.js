import { configToState, stateToConfig, validate } from '../cookieReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('browser reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          name: 'foo',
          value: 'bar',
          valueIsRegex: true
        }
      }));

      expect(state.toJS()).toEqual({
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      });
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }));

      expect(config).toEqual({
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      });
    });
  });

  describe('validate', () => {
    it('fails if the cookie name is empty', () => {
      let state = validate(fromJS({
        name: ''
      }));

      expect(state.getIn(['errors', 'nameInvalid'])).toBe(true);
    });

    it('fails if the cookie value is empty', () => {
      let state = validate(fromJS({
        value: ''
      }));

      expect(state.getIn(['errors', 'valueInvalid'])).toBe(true);
    });
  });
});
