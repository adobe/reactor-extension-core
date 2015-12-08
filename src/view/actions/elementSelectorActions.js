import Rx from 'rx';
import store from '../store';

let elementSelector = new Rx.Subject();
elementSelector.map(elementSelector => {
  return state => state.set('elementSelector', elementSelector);
}).subscribe(store);

export default {
  elementSelector
};
