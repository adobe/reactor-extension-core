/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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
import { Field } from 'redux-form';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

const Sampling = () => (
  <div>
    <label>
      <span className="u-label">Allow condition to return true</span>
      <Field
        name="rate"
        component={ DecoratedInput }
        inputComponent={ Textfield }
        inputClassName="u-smallTextfield"
      />
      <span className="u-label u-gapLeft">percent of the time.</span>
    </label>
  </div>
);

export default Sampling;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      // The only reason we round and only allow integers in the input is because it's the
      // simplest way to deal with floating point precision issues. For example, if the user
      // had a rate of .544, then we were to multiply by 100, it would end up showing
      // 54.400000000000006 in the input field. If we need to support more granularity, we can, as
      // long as we solve for the floating point issue.
      rate: settings.hasOwnProperty('rate') ? Math.round(settings.rate * 100) : 50
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      rate: Number(values.rate) / 100
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.rate === '' ||
      isNaN(values.rate) ||
      Number(values.rate) < 0 ||
      Number(values.rate) > 100 ||
      Number(values.rate) !== Math.round(Number(values.rate))) {
      errors.rate = 'Please specify an integer between 0 and 100.';
    }

    return errors;
  }
};
