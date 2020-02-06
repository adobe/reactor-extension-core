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
import Button from '@react/react-spectrum/Button';
import Close from '@react/react-spectrum/Icon/Close';
import Textfield from '@react/react-spectrum/Textfield';
import { FieldArray } from 'redux-form';
import WrappedField from '../../components/wrappedField';
import RegexToggle from '../../components/regexToggle';

const ElementPropertiesRenderer = ({ fields }) => (
  <div className="u-gapBottom">
    {
      fields.map((field, index) => (
        <div key={field} data-row className="u-gapBottom">
          <WrappedField
            name={`${field}.name`}
            placeholder="Property"
            component={Textfield}
            componentClassName="u-fieldLong"
          />
          <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">&#61;</span>
          <WrappedField
            name={`${field}.value`}
            className="u-gapRight"
            placeholder="Value"
            component={Textfield}
            componentClassName="u-fieldLong"
          />
          <WrappedField
            name={`${field}.valueIsRegex`}
            component={RegexToggle}
            valueFieldName={`${field}.value`}
          />
          <Button
            className="u-gapBottom"
            variant="action"
            quiet
            icon={<Close />}
            onClick={fields.remove.bind(this, index)}
          />
        </div>
      ))
    }
    <Button onClick={() => fields.push({})}>Add Another</Button>
  </div>
);

const ElementPropertiesEditor = () => (
  <FieldArray
    component={ElementPropertiesRenderer}
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
