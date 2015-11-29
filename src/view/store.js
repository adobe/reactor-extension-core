'use strict';
import Bacon from 'baconjs';
import Immutable from 'immutable';

let stateUpdate = new Bacon.Bus();

let initialState = Immutable.Map();

let stateStream = stateUpdate.scan(initialState, (previousState, operation) => {
  return operation(previousState);
}).toProperty();

var getByPath = (object, path) => {
  return object.getIn(path.split('.'));
};

var getStreamForPartialConfig = (path) => {
  return stateStream.map((value) => {
    return getByPath(value, path);
  });
};

var doArraysContainEqualItems = (oldValue, newValue) => {
  for (var i = 0; i < newValue.length; i++) {
    if (!Immutable.is(oldValue[i], newValue[i])) {
      return false;
    }
  }

  return true;
};

stateStream.filterByChanges = (path) => {
  var paths = Array.isArray(path) ? path : [path];
  var sampleStreams = paths.map(getStreamForPartialConfig);

  var combinedSampleStream = Bacon
    .zipAsArray(sampleStreams)
    .skipDuplicates(doArraysContainEqualItems);

  return stateStream.sampledBy(combinedSampleStream);
};

// bacon streams do not actually do anything until there is a subscription.
// thus we need to add a subscription to get state up and running.
stateStream.onValue((value) => { console.log(value.toJSON()); });

export default {
  stateUpdate,
  stateStream
};
