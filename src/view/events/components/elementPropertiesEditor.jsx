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
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import RegexToggle from '../../components/regexToggle';

const ElementPropertiesRenderer = ({ fields }) => (
  <div>
    {
      fields.map((field, index) => (
        <div key={ index } data-row className="u-gapBottom">
          <Field
            name={ `${field}.name` }
            placeholder="Property"
            component={ DecoratedInput }
            inputComponent={ Textfield }
          />
          <span className="u-label u-gapLeft">=</span>
          <Field
            name={ `${field}.value` }
            className="u-gapRight"
            placeholder="Value"
            component={ Textfield }
          />
          <Field
            name={ `${field}.valueIsRegex` }
            component={ RegexToggle }
            valueFieldName={ `${field}.value` }
          />
          <Button
            className="u-gapBottom"
            variant="minimal"
            icon="close"
            iconSize="XS"
            onClick={ fields.remove.bind(this, index) }
          />
        </div>
      ))
    }
    <Button onClick={ () => fields.push({}) }>Add</Button>
  </div>
);

const ElementPropertiesEditor = () => (
  <FieldArray
    component={ ElementPropertiesRenderer }
    name="elementProperties"
  />
);

export default ElementPropertiesEditor;

export const formConfig = {
  settingsToFormValues(values, settings) {
    const elementProperties = settings.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({});
    }

    return {
      ...values,
      elementProperties
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    let { elementProperties } = values;

    elementProperties = elementProperties
      .filter(elementProperty => elementProperty.name)
      .map((elementProperty) => {
        elementProperty = {
          ...elementProperty
        };

        // If this seems strange, check http://eslint.org/docs/rules/no-prototype-builtins.
        if (!{}.hasOwnProperty.call(elementProperty, 'value')) {
          elementProperty.value = '';
        }

        return elementProperty;
      });

    if (elementProperties.length) {
      settings.elementProperties = elementProperties;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    errors.elementProperties = (values.elementProperties || []).map((item) => {
      const result = {};

      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    return errors;
  }
};
