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

import extensionViewReduxForm from '../extensionViewReduxForm';

const PreviousConverter = () => (
  <label className="u-gapRight">
    <span className="u-label">
      Data element identifying whether the user is a previous converter
    </span>
    <Field
      name="dataElement"
      component={ DecoratedInput }
      inputComponent={ Textfield }
      supportDataElementName
    />
    <InfoTip className="u-noPadding" placement="bottom">
      Create and/or select the data element that contains the visitor conversion status. Because
      this MUST be a data element, only enter the name--no need to add &quot;%&quot; before or
      after.
    </InfoTip>
  </label>
);

const formConfig = {
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

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(PreviousConverter);
