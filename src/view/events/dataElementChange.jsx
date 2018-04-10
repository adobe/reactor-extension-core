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
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Alert from '@coralui/react-coral/lib/Alert';

import './dataElementChange.styl';

const DataElementChange = () => (
  <div>
    <div>
      <Alert variant="warning" className="DataElementChange-alert">
        This event type polls the data element value to determine if it has changed. If your rule is
        time-sensitive, we recommend using other event types (e.g., Custom Event, Direct Call) to
        manually fire the rule immediately after you have made data element value changes.
      </Alert>
    </div>

    <label>
      <span className="u-label">Data Element Name</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
        supportDataElementName
      />
    </label>
  </div>
);

export default DataElementChange;

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
    if (!values.name) {
      errors = {
        ...errors,
        name: 'Please specify a data element name.'
      };
    }

    return errors;
  }
};
