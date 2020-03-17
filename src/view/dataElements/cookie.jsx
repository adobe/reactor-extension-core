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

import React from 'react';
import Textfield from '@react/react-spectrum/Textfield';
import WrappedField from '../components/wrappedField';

const Cookie = () => (
  <label>
    <span className="u-verticalAlignMiddle u-gapRight">Cookie Name</span>
    <WrappedField
      name="name"
      component={Textfield}
      componentClassName="u-fieldExtraLong"
    />
  </label>
);

export default Cookie;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a cookie name.';
    }

    // This RegEx is created from:
    // http://stackoverflow.com/questions/1969232/allowed-characters-in-cookies
    if (!/^[a-zA-Z0-9!#$%&'*+-.^_"|~]+$/.test(values.name)) {
      errors.name = 'The cookie name must be a sequence of alphanumeric characters and/or ' +
        'the following special characters: ! # $ % & \' * + - . ^ _ | ~';
    }

    return errors;
  }
};
