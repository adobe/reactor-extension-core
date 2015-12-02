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

/**
 * Each reducer receives the state and transforms the config object on the state so that
 * it can be appropriately persisted.
 * @type {Function[]}
 */
let egressReducers = [
  function egressShowElementFilterFields(state) {
    if (!state.showElementFilterFields) {
      delete state.config.elementSelector;
      delete state.config.elementProperties;
    }
    return state;
  },
  function egressElementProperties(state) {
    let elementProperties = state.config.elementProperties;

    if (elementProperties) {
      for (var i = elementProperties.length - 1; i >= 0; i--) {
        var elementProperty = elementProperties[i];
        // If the element property has a name, we'll keep it around. If it doesn't, then the object
        // is not purposeful and we can remove it.
        if (elementProperty.name) {
          // Delete the ID generated on ingress since it was only used for
          // view rendering purposes.
          delete elementProperty.id;
        } else {
          elementProperties.splice(i, 1);
        }
      }

      if (!elementProperties.length) {
        delete state.config.elementProperties;
      }
    }

    return state;
  }
];

/**
 * Each ingress reducer receives the state and transforms it so that it can be appropriately
 * rendered.
 * @type {Function[]}
 */
let ingressReducers = [
  function ingressShowElementFilterFields(state, isNewConfig) {
    state.showElementFilterFields = Boolean(
      isNewConfig ||
      state.config.elementSelector ||
      state.config.elementProperties
    );
    return state;
  },
  function ingressElementProperties(state) {
    let elementProperties = state.config.elementProperties;

    if (!elementProperties) {
      elementProperties = state.config.elementProperties = [];
    }

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    // Generate IDs to be used as keys when looping over them in the component
    // render function.
    elementProperties.forEach(function(elementProperty) {
      elementProperty.id = createID()
    });

    return state;
  },
  function ingressBubbleOptions(state, isNewConfig) {
    if (isNewConfig) {
      state.config.bubbleFireIfParent = true;
      state.config.bubbleFireIfChildFired = true;
    }
    return state;
  }
];

let getConfig = () => {
  let state = latestState.toJS();
  egressReducers.forEach(reducer => state = reducer(state));
  return state.config;
};

let setConfig = config => {
  let isNewConfig = config === undefined;
  let state = {
    config: config || {}
  };
  ingressReducers.forEach(reducer => state = reducer(state, isNewConfig));
  actions.replaceState.push(Immutable.fromJS(state));
};

// Initialize assuming we're creating a new config.
setConfig();

export default (extensionBridge) => {
  extensionBridge.getConfig = getConfig;
  extensionBridge.setConfig = setConfig;
};
