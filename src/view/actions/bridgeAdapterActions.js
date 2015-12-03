import Bacon from 'baconjs';
import {stateUpdate} from '../store';

let replaceState = new Bacon.Bus();
stateUpdate.plug(replaceState.map(state => {
  return () => state;
}));

let setValidationErrors = new Bacon.Bus();
stateUpdate.plug(setValidationErrors.map(errors => {
  return state => {
    return state.set('validationErrors', errors);
  };
}));

export default {
  replaceState,
  setValidationErrors
};
