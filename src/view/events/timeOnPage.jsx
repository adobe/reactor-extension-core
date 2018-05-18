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
import Textfield from '@react/react-spectrum/Textfield';
import WrappedField from '../components/wrappedField';

import { isNumberLikeInRange } from '../utils/validators';

const TimeOnPage = () => (
  <div>
    <label>
      <span className="u-verticalAlignMiddle u-gapRight u-gapRight">Trigger after</span>
    </label>
    <WrappedField
      name="timeOnPage"
      component={ Textfield }
    />
    <label>
      <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">seconds spent on the page</span>
    </label>
  </div>
);

export default TimeOnPage;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings: (settings, values) => ({
    ...settings,
    timeOnPage: Number(values.timeOnPage)
  }),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!isNumberLikeInRange(values.timeOnPage, { min: 1 })) {
      errors.timeOnPage = 'Please specify a number greater than or equal to 1.';
    }

    return errors;
  }
};
