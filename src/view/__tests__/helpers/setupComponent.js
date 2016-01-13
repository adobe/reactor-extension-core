import React from 'react';
 import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux'
import reducer from '../../actions/index';
import { createStore } from 'redux';
import bridgeAdapter from '../../bridgeAdapter';
import { setBridgeAdapterReducers } from '../../bridgeAdapter';

export default (Component, reducers) => {
  const store = createStore(reducer, {});
  const extensionBridge = {};
  setBridgeAdapterReducers(reducers);
  bridgeAdapter(extensionBridge, store);

  return {
    instance: TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Component />
      </Provider>
    ),
    extensionBridge
  };
};
