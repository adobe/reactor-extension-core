import React from 'react';
 import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux'
import reducer from '../../actions/reducer';
import { createStore } from 'redux';
import bridgeAdapter from '../../bridgeAdapter';

export default (Component, reducers) => {
  const store = createStore(reducer, {});
  const extensionBridge = {};
  const setReducersForCurrentRoute = bridgeAdapter(extensionBridge, store);
  setReducersForCurrentRoute(reducers);

  return {
    instance: TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Component />
      </Provider>
    ),
    extensionBridge
  };
};
