import Rx from 'rx';
import store from '../store';

let delayLinkActivation = new Rx.Subject();
delayLinkActivation.map(enabled => {
  return state => state.set('delayLinkActivation', enabled);
}).subscribe(store);

export default {
  delayLinkActivation
};
