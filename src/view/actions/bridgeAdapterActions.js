import Redux from 'rx';
import store from '../store';

let config = new Rx.Subject();
config.map(event => {
  return state => event.reducer(state, event.config, event.isNewConfig);
}).subscribe(store);

let validate = new Rx.Subject();
validate.map((event) => {
  return state => event.reducer(state);
}).subscribe(store);

export default {
  config,
  validate
};
