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
import { Field, FieldArray } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import MultipleItemEditor from './components/multipleItemEditor';
import RegexToggle from '../components/regexToggle';

const renderItem = field => (
  <div data-row className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Hash equals</span>
      <Field
        name={ `${field}.value` }
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>

    <Field
      name={ `${field}.valueIsRegex` }
      component={ RegexToggle }
      valueFieldName={ `${field}.value` }
    />
  </div>
);

export default () => (
  <FieldArray
    name="hashes"
    renderItem={ renderItem }
    component={ MultipleItemEditor }
  />
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.hashes) {
      values.hashes = [];
    }

    if (!values.hashes.length) {
      values.hashes.push({});
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    // We intentionally don't filter out empty values because a user may be attempting
    // to match an empty hash.
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const hashesErrors = (values.hashes || []).map((hash) => {
      const result = {};

      if (!hash.value) {
        result.value = 'Please specify a hash.';
      }

      return result;
    });

    errors.hashes = hashesErrors;

    return errors;
  }
};
