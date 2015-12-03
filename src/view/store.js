'use strict';
import Bacon from 'baconjs';
import {Map} from 'immutable';

let stateUpdate = new Bacon.Bus();

let initialState = Map();

let stateStream = stateUpdate.scan(initialState, (previousState, operation) => {
  return operation(previousState);
}).toProperty();

// bacon streams do not actually do anything until there is a subscription.
// thus we need to add a subscription to get state up and running.
stateStream.onValue((value) => { console.log(value.toJSON()); });

export {
  stateUpdate,
  stateStream
};
