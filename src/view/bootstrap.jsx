/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

/*eslint import/no-extraneous-dependencies: 0*/
/*eslint no-underscore-dangle: 0*/

import React from 'react';
import {
  Provider as ProviderReactSpectrum,
  lightTheme
} from '@adobe/react-spectrum';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { reduxForm } from 'redux-form';
import reducer from './reduxActions/reducer';
import bridgeAdapter from './bridgeAdapter';

export default (
  View,
  formConfig,
  extensionBridge = window.extensionBridge,
  viewProps
) => {
  const store = createStore(
    reducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  const ViewWrapper = ({ initializedByBridge, error, ...rest }) =>
    initializedByBridge ? (
      <View {...rest} componentsWithErrors={error || []} />
    ) : null;

  const ReduxView = connect(({ initializedByBridge }) => ({
    initializedByBridge
  }))(ViewWrapper);

  const { validate: formConfigValidate } = formConfig;

  const ReduxFormView = reduxForm({
    form: 'default',
    // Proxy the provided validate reducer using a function that matches what redux-form expects.
    // Note that there's no technical reason why config.validate must be a reducer. It does
    // maintain some consistency with settingsToFormValues and formValuesToSettings.
    validate: formConfigValidate
      ? (values) => formConfigValidate({}, values, store.getState().meta)
      : undefined,
    // ReduxForm will complain with we try to "submit" the form and don't have onSubmit defined.
    onSubmit: () => {}
  })(ReduxView);

  bridgeAdapter(extensionBridge, store, formConfig);

  return (
    <Provider store={store}>
      <ProviderReactSpectrum colorScheme="light" theme={lightTheme}>
        <ReduxFormView {...viewProps} />
      </ProviderReactSpectrum>
    </Provider>
  );
};
