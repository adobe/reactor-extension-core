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
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import { Field } from 'redux-form';


import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const TimeOnSite = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">User has spent</span>
        <Field
          name="operator"
          component={ Select }
          options={ comparisonOperatorOptions }
          backspaceRemoves={ false }
        />
      </label>
      <label>
        <Field
          name="minutes"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="u-smallTextfield"
        />
        <span className="u-label u-gapLeft">minutes on site</span>
      </label>
    </div>
  </div>
);

export default TimeOnSite;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      minutes: Number(values.minutes)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumberLike(values.minutes)) {
      errors.minutes = 'Please specify a positive number of minutes.';
    }

    return errors;
  }
};
