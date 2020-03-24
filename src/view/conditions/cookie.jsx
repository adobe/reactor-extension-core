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

import RegexToggle from '../components/regexToggle';

const Cookie = () => (
  <div>
    <label className="u-gapRight u-gapBottom u-noWrap u-flex">
      <span className="u-flexCenter u-gapRight">Cookie named</span>
      <WrappedField
        className="u-flexOne"
        name="name"
        component={Textfield}
        componentClassName="u-fullWidth u-minFieldWidth"
      />
      <div className="u-toolTipMinimumSize"> </div>
    </label>

    <div className="u-inlineBlock u-gapRight u-gapBottom u-noWrap u-flex">
      <span className="u-flexCenter u-gapRight">has the value</span>
      <label className="u-flexOne u-gapRight">
        <WrappedField
          className="u-fullWidth"
          name="value"
          component={Textfield}
          componentClassName="u-fullWidth u-minFieldWidth"
        />
      </label>
      <WrappedField
        name="valueIsRegex"
        component={RegexToggle}
        valueFieldName="value"
      />
    </div>
  </div>
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

    if (!/^[A-Za-z0-9!#$%&'*+\-.^_|~]+$/.test(values.name)) {
      errors.name = 'The cookie name can be any US-ASCII characters except control characters ' +
        '(CTLs), spaces, or tabs. It also must not contain a separator character like the ' +
        'following: ( ) < > @ , ; : \\ " /  [ ] ? = { }';
    }

    if (!values.value) {
      errors.value = 'Please specify a cookie value.';
    }

    return errors;
  }
};
