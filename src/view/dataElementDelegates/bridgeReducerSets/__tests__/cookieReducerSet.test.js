import { configToState, stateToConfig, validate } from '../cookieReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('custom reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          name: 'foo'
        }
      }));

      expect(state.get('name')).toBe('foo');
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        name: 'foo'
      }));

      expect(config.name).toBe('foo');
    });
  });

  describe('validate', () => {
    it('fails if the cookie name is empty', () => {
      let state = validate(fromJS({
        name: ''
      }));

      expect(state.getIn(['errors', 'nameInvalid'])).toBe(true);
    });
  })

});
