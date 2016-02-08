import React from 'react';
 import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import reducer from '../../actions/reducer';
import { createStore } from 'redux';
import bridgeAdapter from '../../bridgeAdapter';

export default (Component, reducers) => {
  const store = createStore(reducer, {});
  const extensionBridge = {};
  const setReducersForCurrentRoute = bridgeAdapter(extensionBridge, store);
  setReducersForCurrentRoute(reducers);

  const providerInstance = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <Component />
    </Provider>
  );

  // Have to do this mess in order to get the wrapped component because redux-form doesn't
  // expose any method for us to do so. https://github.com/erikras/redux-form/issues/202
  const instance = TestUtils.findAllInRenderedTree(providerInstance, function(component) {
    return component.refs && component.refs.extensionViewWrappedComponent;
  })[0].refs.extensionViewWrappedComponent;

  return {
    instance,
    extensionBridge
  };
};
