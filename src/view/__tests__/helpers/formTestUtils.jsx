/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '../../reduxActions/reducer';
import bridgeAdapter from '../../bridgeAdapter';

export const createExtensionBridge = () => {
  let registeredOptions;

  return {
    register(options) {
      registeredOptions = options;
    },
    init(...args) {
      return registeredOptions.init.apply(this, args);
    },
    validate(...args) {
      return registeredOptions.validate.apply(this, args);
    },
    getSettings(...args) {
      return registeredOptions.getSettings.apply(this, args);
    },
    openCodeEditor() {},
    openRegexTester() {},
    openDataElementSelector() {}
  };
};

export const getFormComponent = (FormComponent, extensionBridge, props = {}) => {
  const store = createStore(reducer, {});
  const setFormConfigForCurrentRoute = bridgeAdapter(extensionBridge, store);

  setFormConfigForCurrentRoute(FormComponent.formConfig);

  return (
    <Provider store={ store }>
      <FormComponent { ...props } />
    </Provider>
  );
};
