'use strict';
import {stateStream} from './store';
import Immutable from 'immutable';
import {replaceState} from './actions';
import createID from './utils/createID';

var latestState;
stateStream.onValue((state) => {
  latestState = state;
});

var getConfig = () => {
  let state = Immutable.toJS(latestState);
  let config = state.config || {};

  let elementPropertiesObjects = config.elementProperties;
  let elementPropertiesMap = {};

  if (state.showElementFilterFields && elementPropertiesObjects) {
    elementPropertiesObjects.forEach((elementPropertiesObject) => {
      if (elementPropertiesObject.name) {
        elementPropertiesMap[elementPropertiesObject.name] = elementPropertiesObject.value;
      }
    });
  }

  if (Object.keys(elementPropertiesMap).length) {
    config.elementProperties = elementPropertiesMap;
  } else {
    delete config.elementProperties;
  }

  return config;
};

var setConfig = (config) => {
  let showElementFilterFields = config.elementSelector || config.elementProperties;

  let elementPropertiesMap = config.elementProperties;
  let elementPropertiesObjects = [];

  if (elementPropertiesMap && Object.keys(elementPropertiesMap).length) {
    Object.keys(elementPropertiesMap).forEach(function(name) {
      elementPropertiesObjects.push({
        id: createID(),
        name,
        value: elementPropertiesMap[name]
      });
    });
  } else {
    elementPropertiesObjects.push({
      id: createID(),
      name: '',
      value: ''
    });
  }

  config.elementProperties = elementPropertiesObjects;

  var state = Immutable.Map({
    config: Immutable.fromJS(config),
    showElementFilterFields: showElementFilterFields
  });

  replaceState.push(state);
};

// temporary
//var xyz = {
//  elementProperties: {
//    foo: /b\/a\.r/i,
//    bing: 'baz'
//  }
//};
//setInterval(function() {
//  console.log(config);
//}, 1000);

setConfig({
  elementSelector: 'woot',
  elementProperties: {
    foo: 'bar',
    goo: /shoe/i
  }
});

export default (extensionBridge) => {
  extensionBridge.getConfig = getConfig;
  extensionBridge.setConfig = setConfig;
};
