import Rx from 'rx';
import store from '../store';

let bubbleFireIfParent = new Rx.Subject();
bubbleFireIfParent.map(enabled => {
  return state => state.set('bubbleFireIfParent', enabled);
}).subscribe(store);

let bubbleFireIfChildFired = new Rx.Subject();
bubbleFireIfChildFired.map(enabled => {
  return state => state.set('bubbleFireIfChildFired', enabled);
}).subscribe(store);

let bubbleStop = new Rx.Subject();
bubbleStop.map(enabled => {
  return state => state.set('bubbleStop', enabled);
}).subscribe(store);

export default {
  bubbleFireIfParent,
  bubbleFireIfChildFired,
  bubbleStop
};
