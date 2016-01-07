import { configToState, stateToConfig } from '../domainReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('domain reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          domains: ['a', 'b']
        },
        propertyConfig: {
          domainList: ['a', 'b', 'c']
        }
      }));

      expect(state.get('selectedDomains').toJS()).toEqual(['a', 'b']);
      expect(state.get('availableDomains').toJS()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        selectedDomains: ['a', 'b']
      }));

      expect(config.domains).toEqual(['a', 'b']);
    });
  });

});
