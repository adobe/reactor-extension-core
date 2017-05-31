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
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import Icon from '@coralui/react-coral/lib/Icon';

import extensionViewReduxForm from '../extensionViewReduxForm';

const DirectCall = () => (
  <label>
    <span className="u-label">Identifier</span>
    <Field
      name="identifier"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
    <Tooltip
      openOn="hover"
      content="The string you will pass to _satellite.track() to fire the rule."
    >
      <Icon icon="infoCircle" size="XS" className="u-inline-tooltip u-gapLeft" />
    </Tooltip>
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

    if (!values.identifier) {
      errors.identifier = 'Please specify an identifier.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DirectCall);
