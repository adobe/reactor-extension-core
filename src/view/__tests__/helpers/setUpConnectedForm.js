import React from 'react';
 import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import reducer from '../../actions/reducer';
import { createStore } from 'redux';
import bridgeAdapter from '../../bridgeAdapter';

export default (FormComponent) => {
  const store = createStore(reducer, {});

  const extensionBridge = {
    register: function(options) {
      this._registeredOptions = options;
    },
    init: function() {
      return this._registeredOptions.init.apply(this, arguments);
    },
    validate: function() {
      return this._registeredOptions.validate.apply(this, arguments);
    },
    getSettings: function() {
      return this._registeredOptions.getSettings.apply(this, arguments);
    }
  };

  const setFormConfigForCurrentRoute = bridgeAdapter(extensionBridge, store);

  setFormConfigForCurrentRoute(FormComponent.formConfig);

  const providerInstance = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <FormComponent />
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
