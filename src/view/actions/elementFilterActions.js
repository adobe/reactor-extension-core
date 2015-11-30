import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let setShowElementFilterFields = new Bacon.Bus();
stateUpdate.plug(setShowElementFilterFields.map((showElementFilterFields) => {
  return (state) => {
    return state.set('showElementFilterFields', showElementFilterFields);
  };
}));

export default {
  setShowElementFilterFields
};
