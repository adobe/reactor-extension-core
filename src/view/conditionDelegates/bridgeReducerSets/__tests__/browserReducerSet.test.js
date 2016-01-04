import { configToState, stateToConfig, validate } from '../browserReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('browser reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          browsers: ['a', 'b']
        }
      }));

      expect(state.get('browsers').toJS()).toEqual(['a', 'b']);
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        browsers: ['a', 'b']
      }));

      expect(config.browsers).toEqual(['a', 'b']);
    });
  });

});
