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
import Select from '@react/react-spectrum/Select';
import WrappedField from '../components/wrappedField';
import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import { isNumberLikeInRange } from '../utils/validators';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

const timePlayedUnitOptions = [
  {
    value: timePlayedUnit.SECOND,
    label: 'seconds'
  },
  {
    value: timePlayedUnit.PERCENT,
    label: 'percent'
  }
];

const MediaTimePlayed = () => (
  <div>
    <ElementFilter />
    <div className="u-gapTop">
      <label>
        <span className="u-verticalAlignMiddle u-gapRight">Trigger when</span>
        <WrappedField
          name="amount"
          component={Textfield}
        />
      </label>
      <WrappedField
        name="unit"
        className="u-gapLeft"
        component={Select}
        options={timePlayedUnitOptions}
      />
      <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">have passed</span>
    </div>
    <AdvancedEventOptions />
  </div>
);

export default MediaTimePlayed;

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      unit: settings.unit || timePlayedUnit.SECOND
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      unit: values.unit,
      amount: Number(values.amount)
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (!isNumberLikeInRange(values.amount, { min: 0, minInclusive: false })) {
        errors.amount = 'Please specify a positive number';
      }

      return errors;
    }
  }
);
