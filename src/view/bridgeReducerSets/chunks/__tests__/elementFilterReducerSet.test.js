import getConfigFromStoreState from './helpers/getConfigFromStoreState';
import elementFilterReducerSet from '../elementFilterReducerSet';
import {actionCreators} from '../../../actions/bridgeAdapterActions';
import Immutable, { Map } from 'immutable';

let { configToState, stateToConfig } = elementFilterReducerSet;

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

    it('sets elementSelector to false', () => {
      expect(state.get('elementSelector')).toBeUndefined();
    });

    it('sets elementProperties to an list with 1 empty item', () => {
      expect(state.get('elementProperties').count()).toBe(1);
      expect(state.get('elementProperties').first().get('name')).toBe('');
      expect(state.get('elementProperties').first().get('value')).toBe('');
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
            value: 'other value'
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

      expect(state.get('elementProperties').last().get('name')).toBe('other name');
      expect(state.get('elementProperties').last().get('value')).toBe('other value');
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
    var config = getConfigFromStoreState({
      showSpecificElementsFilter: true,
      elementSelector: 'a'
    }, stateToConfig);
    expect(config.elementSelector).toBe('a');
  });

  it('should return a config without selector ' +
    'when state contains showSpecificElementsFilter: false', () => {
    var config = getConfigFromStoreState({
      showSpecificElementsFilter: false,
      elementSelector: 'a'
    }, stateToConfig);
    expect(config.elementSelector).toBeUndefined();
  });

  it('should return a config having elementProperties ' +
    'when state contains showSpecificElementsFilter: true', () => {
    var config = getConfigFromStoreState({
      showSpecificElementsFilter: true,
      showElementPropertiesFilter: true,
      elementProperties: Immutable.fromJS({id: {id: 'id', name: 'name', value: 'value'}})
    }, stateToConfig);
    expect(config.elementProperties[0].toJS()).toEqual({value: 'value', name: 'name'});
  });

  it('should return a config without elementProperties ' +
    'when state contains showSpecificElementsFilter: false', () => {
    var config = getConfigFromStoreState({
      showSpecificElementsFilter: false,
      showElementPropertiesFilter: true,
      elementProperties: Immutable.fromJS({id: {id: 'id', name: 'name', value: 'value'}})
    }, stateToConfig);
    expect(config.elementProperties).toBeUndefined();
  });
});
