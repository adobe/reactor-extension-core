import { configToState, stateToConfig } from '../deviceTypeReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('device type reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          deviceTypes: ['a', 'b']
        }
      }));

      expect(state.get('deviceTypes').toJS()).toEqual(['a', 'b']);
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        deviceTypes: ['a', 'b']
      }));

      expect(config.deviceTypes).toEqual(['a', 'b']);
    });
  });

});
