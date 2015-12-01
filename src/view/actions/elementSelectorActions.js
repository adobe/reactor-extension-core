import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let setElementSelector = new Bacon.Bus();
stateUpdate.plug(setElementSelector.map(elementSelector => {
  return state => {
    return state.update('config', config => {
      return elementSelector ?
        config.set('elementSelector', elementSelector) :
        config.delete('elementSelector');
    });
  };
}));

export default {
  setElementSelector
};
