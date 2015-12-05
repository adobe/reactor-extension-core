import Bacon from 'baconjs';
import { stateUpdate } from '../store';

let config = new Bacon.Bus();
stateUpdate.plug(config.map(event => {
  return state => event.reducer(state, event.config, event.isNewConfig);
}));

let validate = new Bacon.Bus();
stateUpdate.plug(validate.map((event) => {
  return state => event.reducer(state);
}));

export default {
  config,
  validate
};
