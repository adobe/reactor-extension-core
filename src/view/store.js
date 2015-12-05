'use strict';
import Bacon from 'baconjs';
import { Map } from 'immutable';

let stateUpdate = new Bacon.Bus();

let latestState = Map();

let stateStream = stateUpdate.scan(latestState, (previousState, operation) => {
  return operation(previousState);
}).toProperty();

// bacon streams do not actually do anything until there is a subscription.
// thus we need to add a subscription to get state up and running.
stateStream.onValue(value => {
  latestState = value;
  console.log(value.toJSON());
});

let getState = () => latestState;

export {
  stateUpdate,
  stateStream,
  getState
};
