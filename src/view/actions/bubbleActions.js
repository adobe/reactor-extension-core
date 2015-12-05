import Bacon from 'baconjs';
import { stateUpdate } from '../store';

let bubbleFireIfParent = new Bacon.Bus();
stateUpdate.plug(bubbleFireIfParent.map(enabled => {
  return state => state.set('bubbleFireIfParent', enabled);
}));

let bubbleFireIfChildFired = new Bacon.Bus();
stateUpdate.plug(bubbleFireIfChildFired.map(enabled => {
  return state => state.set('bubbleFireIfChildFired', enabled);
}));

let bubbleStop = new Bacon.Bus();
stateUpdate.plug(bubbleStop.map(enabled => {
  return state => state.set('bubbleStop', enabled);
}));

export default {
  bubbleFireIfParent,
  bubbleFireIfChildFired,
  bubbleStop
};
