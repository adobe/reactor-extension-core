import Rx from 'rx';
import store from '../store';

let showSpecificElementsFilter = new Rx.Subject();
showSpecificElementsFilter.map(show => {
  return (state) => state.set('showSpecificElementsFilter', show);
}).subscribe(store);

let showElementPropertiesFilter = new Rx.Subject();
showElementPropertiesFilter.map(show => {
  return (state) => state.set('showElementPropertiesFilter', show);
}).subscribe(store);

export default {
  showSpecificElementsFilter,
  showElementPropertiesFilter
};
