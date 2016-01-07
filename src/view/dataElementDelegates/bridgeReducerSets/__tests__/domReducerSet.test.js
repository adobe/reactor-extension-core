import { configToState, stateToConfig, validate } from '../domReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('dom reducer set', () => {
  describe('configToState', () => {
    it('converts config to state when a preset property is used', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          elementSelector: 'foo',
          elementProperty: 'innerHTML'
        }
      }));

      expect(state.toJS()).toEqual({
        elementSelector: 'foo',
        selectedElementPropertyPreset: 'innerHTML',
        customElementProperty: undefined,
        elementPropertyPresets: jasmine.any(Object)
      });
    });

    it('converts config to state when a custom property is used', () => {
      let state = configToState(Map(), actionCreators.setConfig({
        config: {
          elementSelector: 'foo',
          elementProperty: 'bar'
        }
      }));

      expect(state.toJS()).toEqual({
        elementSelector: 'foo',
        selectedElementPropertyPreset: 'custom',
        customElementProperty: 'bar',
        elementPropertyPresets: jasmine.any(Object)
      });
    });
  });

  describe('stateToConfig', () => {
    it('converts state to config when a preset property is used', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        elementSelector: 'foo',
        selectedElementPropertyPreset: 'innerHTML',
        customElementProperty: 'bar'
      }));

      expect(config).toEqual({
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      });
    });

    it('converts state to config when a custom property is used', () => {
      let config = {};

      config = stateToConfig(config, fromJS({
        elementSelector: 'foo',
        selectedElementPropertyPreset: 'custom',
        customElementProperty: 'bar'
      }));

      expect(config).toEqual({
        elementSelector: 'foo',
        elementProperty: 'bar'
      });
    });
  });

  describe('validate', () => {
    it('fails if elementSelector is empty', () => {
      let state = validate(fromJS({
        elementSelector: ''
      }));

      expect(state.getIn(['errors', 'elementSelectorIsEmpty'])).toBe(true);
    });

    it('fails if a custom property is empty', () => {
      let state = validate(fromJS({
        selectedElementPropertyPreset: 'custom',
        customElementProperty: ''
      }));

      expect(state.getIn(['errors', 'elementPropertyIsEmpty'])).toBe(true);
    });

    it('does not fail if a preset property is selected and the custom property is empty', () => {
      let state = validate(fromJS({
        selectedElementPropertyPreset: 'innerHTML',
        customElementProperty: ''
      }));

      expect(state.getIn(['errors', 'elementPropertyIsEmpty'])).toBe(false);
    });
  })

});
