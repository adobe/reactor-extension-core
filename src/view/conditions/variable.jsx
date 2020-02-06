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
import InfoTip from '../components/infoTip';
import RegexToggle from '../components/regexToggle';
import WrappedField from '../components/wrappedField';

const Variable = () => (
  <div>
    <label className="u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <span className="u-verticalAlignMiddle u-gapRight">JavaScript variable named</span>
      <WrappedField
        name="name"
        component={Textfield}
        componentClassName="u-fieldExtraLong"
        placeholder="dataLayer.products.1.price"
      />
    </label>
    <div className="u-inlineBlock u-gapRight u-gapBottom u-noWrap u-floatLeft">
      <label>
        <span className="u-verticalAlignMiddle u-gapRight">has the value</span>
        <WrappedField
          name="value"
          component={Textfield}
          componentClassName="u-fieldExtraLong"
        />
      </label>
      <InfoTip className="u-gapRight" placement="bottom">
        Specify a text (string) value here. The rule will only fire if the specified
        variable contains this string. Note: If your variable contains a number, this will not
        work as expected.
      </InfoTip>
      <WrappedField
        name="valueIsRegex"
        component={RegexToggle}
        valueFieldName="value"
      />
    </div>
  </div>
);

export default Variable;

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
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};
