import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let setDelayLinkActivation = new Bacon.Bus();
stateUpdate.plug(setDelayLinkActivation.map(enabled => {
  return state => {
    return state.update('config', config => {
      return enabled ?
        config.set('delayLinkActivation', true) :
        config.delete('delayLinkActivation');
    });
  };
}));

export default {
  setDelayLinkActivation
};
