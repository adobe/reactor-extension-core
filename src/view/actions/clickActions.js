import Bacon from 'baconjs';
import { stateUpdate } from '../store';

let delayLinkActivation = new Bacon.Bus();
stateUpdate.plug(delayLinkActivation.map(enabled => {
  return state => state.set('delayLinkActivation', enabled);
}));

export default {
  delayLinkActivation
};
