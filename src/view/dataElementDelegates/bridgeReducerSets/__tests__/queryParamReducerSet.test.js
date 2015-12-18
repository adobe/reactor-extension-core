import { configToState, stateToConfig, validate } from '../queryParamReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('query param reducer set', () => {
  describe('configToState', () => {
    it('converts config to state', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          name: 'foo',
          caseInsensitive: true
        }
      }));

      expect(state.toJS()).toEqual({
        name: 'foo',
        caseInsensitive: true
      });
    });

    it('sets caseInsensitive to true for a new config', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {},
        isNewConfig: true
      }));

      expect(state.toJS()).toEqual({
        name: undefined,
        caseInsensitive: true
      });
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        name: 'foo',
        caseInsensitive: true
      }));

      expect(config).toEqual({
        name: 'foo',
        caseInsensitive: true
      });
    });
  });

  describe('validate', () => {
    it('fails if the name is empty', () => {
      let state = validate(fromJS({
        name: ''
      }));

      expect(state.getIn(['errors', 'nameInvalid'])).toBe(true);
    });
  })

});
