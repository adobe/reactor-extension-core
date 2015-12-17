import { configToState, stateToConfig } from '../elementFilterReducerSet';
import { actionCreators } from '../../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('element filter reducer set', () => {
  describe('configToState', () => {
    describe('for a new config', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {},
          isNewConfig: true
        }));
      });

      it('sets showSpecificElementsFilter to true', () => {
        expect(state.get('showSpecificElementsFilter')).toBe(true);
      });

      it('sets showElementPropertiesFilter to false', () => {
        expect(state.get('showElementPropertiesFilter')).toBe(false);
      });

      it('sets elementSelector to undefined', () => {
        expect(state.get('elementSelector')).toBeUndefined();
      });

      it('sets elementProperties to an list with 1 empty item', () => {
        expect(state.get('elementProperties').count()).toBe(1);
        expect(state.get('elementProperties').first().get('name')).toBe('');
        expect(state.get('elementProperties').first().get('value')).toBe('');
        expect(state.get('elementProperties').first().get('id')).toEqual(jasmine.any(String));
      });
    });

    describe('for a specified config', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {
            elementSelector: 'a',
            elementProperties: [{
              name: 'name',
              value: 'value'
            },{
              name: 'other name',
              value: 'other value',
              valueIsRegex: true
            }]
          },
          isNewConfig: false
        }));
      });

      it('sets showSpecificElementsFilter to the value from config', () => {
        expect(state.get('showSpecificElementsFilter')).toBe(true);
      });

      it('sets showElementPropertiesFilter to true', () => {
        expect(state.get('showElementPropertiesFilter')).toBe(true);
      });

      it('sets elementSelector to the value from config', () => {
        expect(state.get('elementSelector')).toBe('a');
      });

      it('sets elementProperties to an list having the values from config', () => {
        expect(state.get('elementProperties').count()).toBe(2);
        expect(state.get('elementProperties').first().get('name')).toBe('name');
        expect(state.get('elementProperties').first().get('value')).toBe('value');

        expect(state.get('elementProperties').last().get('value')).toBe('other value');
        expect(state.get('elementProperties').last().get('valueIsRegex')).toBe(true);
      });
    });

    describe('for an any element config', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {},
          isNewConfig: false
        }));
      });

      it('sets showSpecificElementsFilter to false', () => {
        expect(state.get('showSpecificElementsFilter')).toBe(false);
      });
    });
  });


  describe('stateToConfig', () => {
    it('should return a config having selector ' +
      'when state contains showSpecificElementsFilter: true', () => {
      let config = {};
      config = stateToConfig(config, fromJS({
        showSpecificElementsFilter: true,
        elementSelector: 'a'
      }));
      expect(config.elementSelector).toBe('a');
    });

    it('should return a config without selector ' +
      'when state contains showSpecificElementsFilter: false', () => {
      let config = {};
      config = stateToConfig(config, fromJS({
        showSpecificElementsFilter: false,
        elementSelector: 'a'
      }));
      expect(config.elementSelector).toBeUndefined();
    });

    it('should return a config without elementProperties ' +
      'when state contains showSpecificElementsFilter: false', () => {
      let config = {};
      config = stateToConfig(config, fromJS({
        showSpecificElementsFilter: false,
        showElementPropertiesFilter: true,
        elementProperties: {
          abc: {
            id: 'abc',
            name: 'name',
            value: 'value'
          }
        }
      }));
      expect(config.elementProperties).toBeUndefined();
    });

    it('should return a config having elementProperties ' +
      'when state contains showSpecificElementsFilter: true', () => {
      let config = {};
      config = stateToConfig(config, fromJS({
        showSpecificElementsFilter: true,
        showElementPropertiesFilter: true,
        elementProperties: {
          abc: {
            id: 'abc',
            name: 'name',
            value: 'value'
          }
        }
      }));
      expect(config.elementProperties[0].toJS()).toEqual({value: 'value', name: 'name'});
    });

    it('should return a config without elementProperties ' +
      'when state contains showElementPropertiesFilter: false', () => {
      let config = {};
      config = stateToConfig(config, fromJS({
        showSpecificElementsFilter: true,
        showElementPropertiesFilter: false,
        elementProperties: {
          abc: {
            id: 'abc',
            name: 'name',
            value: 'value'
          }
        }
      }));
      expect(config.elementProperties).toBeUndefined();
    });
  });
});
