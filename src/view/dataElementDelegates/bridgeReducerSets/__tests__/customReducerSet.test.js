import { configToState, stateToConfig } from '../customReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('custom reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          script: 'foo'
        }
      }));

      expect(state.get('script')).toBe('foo');
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        script: 'foo'
      }));

      expect(config).toEqual({
        script: 'foo',
        __rawScripts: ['script']
      });
    });
  });
});
