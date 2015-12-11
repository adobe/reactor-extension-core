import { Map } from 'immutable';
import { createStore } from 'redux';

export default (config, transformFn) => {
  let store = createStore((state) => { return state; }, Map(config));
  return transformFn({}, store.getState());
};
