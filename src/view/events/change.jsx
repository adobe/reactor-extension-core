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
import Checkbox from '@react/react-spectrum/Checkbox';
import Textfield from '@react/react-spectrum/Textfield';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from '../components/wrappedField';

import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import RegexToggle from '../components/regexToggle';

const Change = ({ showValueField }) => (
  <div>
    <ElementFilter />
    <div>
      <WrappedField
        name="showValueField"
        className="u-block"
        component={Checkbox}
        label="and is changed to the following value..."
      />
      {
        showValueField ?
          (
            <div>
              <WrappedField
                name="value"
                className="u-gapRight"
                placeholder="Value"
                component={Textfield}
                supportDataElement
              />
              <WrappedField
                name="valueIsRegex"
                component={RegexToggle}
                valueFieldName="value"
              />
            </div>
          ) :
          null
      }
    </div>
    <AdvancedEventOptions />
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  showValueField: valueSelector(state, 'showValueField')
});

export default connect(stateToProps)(Change);

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues(values, settings) {
      return {
        ...values,
        value: settings.value,
        valueIsRegex: settings.valueIsRegex,
        showValueField: settings.value !== undefined // empty string is an acceptable value
      };
    },
    formValuesToSettings(settings, values) {
      if (values.showValueField) {
        settings = {
          ...settings,
          value: values.value || '',
          valueIsRegex: values.valueIsRegex
        };
      }

      return settings;
    }
  }
);
