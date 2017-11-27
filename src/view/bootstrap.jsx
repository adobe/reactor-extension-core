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
import { Provider, connect } from 'react-redux';
import { createStore, compose } from 'redux';
import { reduxForm } from 'redux-form';

import reducer from './reduxActions/reducer';
import bridgeAdapter from './bridgeAdapter';

module.exports = (View, formConfig, extensionBridge = window.extensionBridge, viewProps) => {
  const finalCreateStore = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, {});

  const ViewWrapper = props => (props.initializedByBridge ?
    <View { ...props } componentsWithErrors={ props.error || [] } /> :
    null);

  const ReduxView = connect(
    ({ initializedByBridge }) => ({ initializedByBridge })
  )(ViewWrapper);

  const ReduxFormView = reduxForm({
    form: 'default',
    // Proxy the provided validate reducer using a function that matches what redux-form expects.
    // Note that there's no technical reason why config.validate must be a reducer. It does
    // maintain some consistency with settingsToFormValues and formValuesToSettings.
    validate: formConfig.validate ?
      (values) => {
        const errors = formConfig.validate({}, values, store.getState().meta);

        return {
          ...errors,
          // A general form-wide error can be returned via the special _error key.
          // From: http://redux-form.com/6.0.5/examples/submitValidation/
          // If there are no components with errors, we need to set it to undefined instead of an
          // empty array or redux-form will consider the form invalid.
          _error: errors.componentsWithErrors && errors.componentsWithErrors.length ?
            errors.componentsWithErrors : undefined
        };
      } :
      undefined,
    // ReduxForm will complain with we try to "submit" the form and don't have onSubmit defined.
    onSubmit: () => {}
  })(ReduxView);

  bridgeAdapter(extensionBridge, store, formConfig);

  return (
    <Provider store={ store }>
      <ReduxFormView { ...viewProps } />
    </Provider>
  );
};
