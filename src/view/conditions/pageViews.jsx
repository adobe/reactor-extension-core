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
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Textfield from '@react/react-spectrum/Textfield';
import Select from '@react/react-spectrum/Select';
import WrappedField from '../components/wrappedField';

import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const PageViews = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-verticalAlignMiddle u-gapRight">
          The user&apos;s number of page views is
        </span>
        <WrappedField
          name="operator"
          component={Select}
          options={comparisonOperatorOptions}
        />
      </label>
      <label className="u-gapRight">
        <span className="u-verticalAlignMiddle u-gapRight">the value</span>
        <WrappedField
          name="count"
          component={Textfield}
          componentClassName="u-smallTextfield"
        />
      </label>
      <span className="u-noWrap">
        <label>
          <span className="u-verticalAlignMiddle u-gapRight">over</span>
          <WrappedField
            name="duration"
            component={RadioGroup}
          >
            <Radio value="lifetime" label="Lifetime" />
            <Radio value="session" label="Current Session" />
          </WrappedField>
        </label>
      </span>
    </div>
  </div>
);

export default PageViews;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>',
      duration: settings.duration || 'lifetime'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      count: Number(values.count)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumberLike(values.count)) {
      errors.count = 'Please specify a number of page views.';
    }

    return errors;
  }
};
