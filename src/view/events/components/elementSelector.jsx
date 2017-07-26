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
import Link from '@coralui/react-coral/lib/Link';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

export default () => (
  <label>
    <span className="u-label">Elements matching the CSS selector</span>
    <Field
      name="elementSelector"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
    <InfoTip>
      CSS selectors allow you to target specific elements in a webpage.
      <br />
      <Link
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors"
        rel="noopener noreferrer"
        target="_blank"
        subtle
      >
        Learn more about CSS selectors.
      </Link>
    </InfoTip>
  </label>
);

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
      elementSelector: values.elementSelector
    };
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!values.elementSelector) {
      errors.elementSelector = 'Please specify a CSS selector.';
    }

    return errors;
  }
};
