'use strict';
import Bacon from 'baconjs';
import {stateStream} from './store';
import actions from './actions/bridgeAdapterActions';
import Immutable from 'immutable';
import createID from './utils/createID';

let latestState;
stateStream.onValue(state => {
  latestState = state;
});

let getConfig = () => {
  let state = latestState.toJS();
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

let setConfig = config => {
  let isNewConfig = config === undefined;

  config = config || {};

  let showElementFilterFields = Boolean(
      isNewConfig ||
      config.elementSelector ||
      config.elementProperties
    );

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

  let state = Immutable.Map({
    config: Immutable.fromJS(config),
    showElementFilterFields: showElementFilterFields
  });

  actions.replaceState.push(state);
};

// Initialize assuming we're creating a new config.
setConfig();

export default (extensionBridge) => {
  extensionBridge.getConfig = getConfig;
  extensionBridge.setConfig = setConfig;
};
