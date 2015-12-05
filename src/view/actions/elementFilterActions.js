import Bacon from 'baconjs';
import { stateUpdate } from '../store';

let showSpecificElementsFilter = new Bacon.Bus();
stateUpdate.plug(showSpecificElementsFilter.map(show => {
  return (state) => state.set('showSpecificElementsFilter', show);
}));

let showElementPropertiesFilter = new Bacon.Bus();
stateUpdate.plug(showElementPropertiesFilter.map(show => {
  return (state) => state.set('showElementPropertiesFilter', show);
}));

export default {
  showSpecificElementsFilter,
  showElementPropertiesFilter
};
