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
import Select from '@react/react-spectrum/Select';
import WrappedField from '../components/wrappedField';
import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const TimeOnSite = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-verticalAlignMiddle u-gapRight">User has spent</span>
        <WrappedField
          name="operator"
          component={Select}
          options={comparisonOperatorOptions}
        />
      </label>
      <label>
        <WrappedField
          name="minutes"
          component={Textfield}
          componentClassName="u-smallTextfield"
        />
        <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">minutes on site</span>
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
