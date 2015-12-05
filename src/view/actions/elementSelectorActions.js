import Bacon from 'baconjs';
import { stateUpdate } from '../store';

let elementSelector = new Bacon.Bus();
stateUpdate.plug(elementSelector.map(elementSelector => {
  return state => state.set('elementSelector', elementSelector);
}));

export default {
  elementSelector
};
