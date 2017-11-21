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
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import ElementFilter, { formConfig as elementFilterFormConfig } from './components/elementFilter';
import AdvancedEventOptions, { formConfig as advancedEventOptionsFormConfig } from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import RegexToggle from '../components/regexToggle';

const Change = ({ showValueField }) => (
  <div>
    <ElementFilter />
    <div>
      <Field
        name="showValueField"
        className="u-block"
        component={ Checkbox }
      >
        and is changed to the following value...
      </Field>
      {
        showValueField ?
          <div>
            <Field
              name="value"
              className="u-gapRight"
              placeholder="Value"
              component={ DecoratedInput }
              inputComponent={ Textfield }
              supportDataElement
            />
            <Field
              name="valueIsRegex"
              component={ RegexToggle }
              valueFieldName="value"
            />
          </div>
          : null
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
