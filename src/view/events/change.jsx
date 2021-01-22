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
import { Checkbox } from '@adobe/react-spectrum';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from '../components/wrappedField';

import ElementFilter, {
  formConfig as elementFilterFormConfig
} from './components/elementFilter';
import AdvancedEventOptions, {
  formConfig as advancedEventOptionsFormConfig
} from './components/advancedEventOptions';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import FullWidthField from '../components/fullWidthField';

const Change = ({ showValueField }) => (
  <>
    <ElementFilter elementSpecificityLabel="When the user changes" />

    <WrappedField name="showValueField" component={Checkbox}>
      and is changed to the following value...
    </WrappedField>

    {showValueField ? (
      <FullWidthField
        containerMinWidth="size-6000"
        label="Value"
        name="value"
        supportDataElement
        regexName="valueIsRegex"
        regexValueFieldName="value"
        blankSpace={null}
      />
    ) : null}

    <AdvancedEventOptions />
  </>
);

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
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
