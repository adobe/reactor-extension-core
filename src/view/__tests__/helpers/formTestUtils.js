import React from 'react';
 import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import reducer from '../../reduxActions/reducer';
import { createStore } from 'redux';
import bridgeAdapter from '../../bridgeAdapter';

export const createExtensionBridge = () => {
  let registeredOptions;

  return {
    register(options) {
      registeredOptions = options;
    },
    init() {
      return registeredOptions.init.apply(this, arguments);
    },
    validate() {
      return registeredOptions.validate.apply(this, arguments);
    },
    getSettings() {
      return registeredOptions.getSettings.apply(this, arguments);
    },
    openCodeEditor() {},
    openRegexTester() {},
    openDataElementSelector() {}
  };
};

export const getFormInstance = (FormComponent, extensionBridge) => {
  const store = createStore(reducer, {});
  const setFormConfigForCurrentRoute = bridgeAdapter(extensionBridge, store);

  setFormConfigForCurrentRoute(FormComponent.formConfig);

  const providerInstance = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <FormComponent />
    </Provider>
  );

  // Have to do this mess in order to get the wrapped component because redux-form doesn't
  // expose any method for us to do so. https://github.com/erikras/redux-form/issues/202
  return TestUtils.findAllInRenderedTree(providerInstance, function(component) {
    return component.refs && component.refs.extensionViewWrappedComponent;
  })[0].refs.extensionViewWrappedComponent;
};
