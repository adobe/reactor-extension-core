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
import InfoTip from '@reactor/react-components/lib/infoTip';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import RegexToggle from '../components/regexToggle';

const DataElement = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Data element</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
        supportDataElementName
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">has the value</span>
      <Field
        name="value"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
      <InfoTip placement="bottom">
        Specify a text (string) value here. The rule will only fire if the specified data element
        returns this string. Note: if your data element returns a number, this will not work
        as expected.
      </InfoTip>
    </label>
    <Field
      name="valueIsRegex"
      component={ RegexToggle }
      valueFieldName="value"
    />
  </div>
);

export default DataElement;

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
      errors.name = 'Please specify a data element.';
    }

    if (!values.value) {
      errors.value = 'Please specify a value.';
    }

    return errors;
  }
};
