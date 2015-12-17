import { configToState, stateToConfig } from '../clickReducerSet';
import { actionCreators } from '../../../actions/bridgeAdapterActions';
import { Map, fromJS } from 'immutable';

describe('click reducer set', () => {
  describe('configToState', () => {
    describe('for a new config', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {},
          isNewConfig: true
        }));
      });

      it('sets delayLinkActivation to false', () => {
        expect(state.get('delayLinkActivation')).toBe(false);
      });
    });

    describe('for a config with delayLinkActivation: true', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {
            delayLinkActivation: true
          },
          isNewConfig: false
        }));
      });

      it('sets delayLinkActivation to to the value from config', () => {
        expect(state.get('delayLinkActivation')).toBe(true);
      });
    });

    describe('for a config with delayLinkActivation: false', () => {
      let state;
      beforeEach(() => {
        state = configToState(Map(), actionCreators.setConfig({
          config: {
            delayLinkActivation: false
          },
          isNewConfig: false
        }));
      });

      it('sets delayLinkActivation to the value from config', () => {
        expect(state.get('delayLinkActivation')).toBe(false);
      });
    });
  });

  describe('stateToConfig', () => {
    it('should return a config having delayLinkActivation: true ' +
      'when state contains delayLinkActivation: true', () => {
        let config = {};
        config = stateToConfig(config, fromJS({ delayLinkActivation: true }));
        expect(config.delayLinkActivation).toBe(true);
    });

    it('should return a config without delayLinkActivation ' +
      'when state contains delayLinkActivation: false', () => {
      let config = {};
      config = stateToConfig(config, fromJS({ delayLinkActivation: false }));
      expect(config.delayLinkActivation).toBeUndefined();
    });
  });
});
