import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let replaceState = new Bacon.Bus();
stateUpdate.plug(replaceState.map(state => {
  return () => state;
}));

export default {
  replaceState
};
