import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let setBubbleFireIfParent = new Bacon.Bus();
stateUpdate.plug(setBubbleFireIfParent.map(enabled => {
  return state => {
    return state.update('config', config => {
      return enabled ?
        config.set('bubbleFireIfParent', true) :
        config.delete('bubbleFireIfParent');
    });
  };
}));

let setBubbleFireIfChildFired = new Bacon.Bus();
stateUpdate.plug(setBubbleFireIfChildFired.map(enabled => {
  return state => {
    return state.update('config', config => {
      return enabled ?
        config.set('bubbleFireIfChildFired', true) :
        config.delete('bubbleFireIfChildFired');
    });
  };
}));

let setBubbleStop = new Bacon.Bus();
stateUpdate.plug(setBubbleStop.map(enabled => {
  return state => {
    return state.update('config', config => {
      return enabled ?
        config.set('bubbleStop', true) :
        config.delete('bubbleStop');
    });
  };
}));

export default {
  setBubbleFireIfParent,
  setBubbleFireIfChildFired,
  setBubbleStop
};
