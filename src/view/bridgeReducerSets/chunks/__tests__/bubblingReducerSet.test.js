import getConfigFromStoreState from './helpers/getConfigFromStoreState';
import bublingReducerSet from '../bubblingReducerSet';
import {actionCreators} from '../../../actions/bridgeAdapterActions';
import { Map } from 'immutable';

let { configToState, stateToConfig } = bublingReducerSet;

describe('configToState', () => {
  describe('for a new config', () => {
    let state;
    beforeEach(() => {
      state = configToState(Map(), actionCreators.setConfig({
        config: {},
        isNewConfig: true
      }));
    });

    it('sets bubbleFireIfParent to true', () => {
      expect(state.get('bubbleFireIfParent')).toBe(true);
    });

    it('sets bubbleFireIfChildFired to true', () => {
      expect(state.get('bubbleFireIfChildFired')).toBe(true);
    });

    it('sets bubbleStop to false', () => {
      expect(state.get('bubbleStop')).toBe(false);
    });
  });

  describe('for a specified config', () => {
    let state;
    beforeEach(() => {
      state = configToState(Map(), actionCreators.setConfig({
        config: {
          bubbleFireIfParent: false,
          bubbleFireIfChildFired: false,
          bubbleStop: true
        },
        isNewConfig: false
      }));
    });

    it('sets bubbleFireIfParent to the value from config', () => {
      expect(state.get('bubbleFireIfParent')).toBe(false);
    });

    it('sets bubbleFireIfParent to the value from config', () => {
      expect(state.get('bubbleFireIfChildFired')).toBe(false);
    });

    it('sets bubbleFireIfParent to the value from config', () => {
      expect(state.get('bubbleStop')).toBe(true);
    });
  });
});

describe('stateToConfig', () => {
  it('should return a config having bubbleFireIfParent: true ' +
    'when state contains bubbleFireIfParent: true', () => {
      var config = getConfigFromStoreState({bubbleFireIfParent: true}, stateToConfig);
      expect(config.bubbleFireIfParent).toBe(true);
  });

  it('should return a config without bubbleFireIfParent ' +
    'when state contains bubbleFireIfParent: false', () => {
    var config = getConfigFromStoreState({bubbleFireIfParent: false}, stateToConfig);
    expect(config.bubbleFireIfParent).toBeUndefined();
  });

  it('should return a config having bubbleFireIfChildFired: true ' +
    'when state contains bubbleFireIfChildFired: true', () => {
    var config = getConfigFromStoreState({bubbleFireIfChildFired: true}, stateToConfig);
    expect(config.bubbleFireIfChildFired).toBe(true);
  });

  it('should return a config without bubbleFireIfChildFired ' +
    'when state contains bubbleFireIfChildFired: false', () => {
    var config = getConfigFromStoreState({bubbleFireIfChildFired: false}, stateToConfig);
    expect(config.bubbleFireIfChildFired).toBeUndefined();
  });

  it('should return a config having bubbleStop: true ' +
    'when state contains bubbleStop: true', () => {
    var config = getConfigFromStoreState({bubbleStop: true}, stateToConfig);
    expect(config.bubbleStop).toBe(true);
  });

  it('should return a config without bubbleStop ' +
    'when state contains bubbleStop: false', () => {
    var config = getConfigFromStoreState({bubbleStop: false}, stateToConfig);
    expect(config.bubbleStop).toBeUndefined();
  });
});
