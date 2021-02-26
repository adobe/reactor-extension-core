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
import {
  Flex,
  TextField,
  View,
  ActionButton,
  Button,
  Text
} from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Add from '@spectrum-icons/workflow/Add';
import { FieldArray } from 'redux-form';
import WrappedField from '../../components/wrappedField';
import RegexToggle from '../../components/regexToggle';

const ElementPropertiesRenderer = ({ fields }) => (
  <Flex
    direction="column"
    gap="size-200"
    minWidth="size-6000"
    data-testid="element-properties-editor"
  >
    {fields.map((field, index) => (
      <Flex key={field} data-row gap="size-100" alignItems="end">
        <View flex>
          <WrappedField
            label="Property"
            name={`${field}.name`}
            component={TextField}
            width="100%"
          />
        </View>
        <span className="u-gapRight u-gapLeft">&#61;</span>
        <View flex>
          <WrappedField
            label="Value"
            name={`${field}.value`}
            component={TextField}
            width="100%"
          />
        </View>
        <WrappedField
          name={`${field}.valueIsRegex`}
          component={RegexToggle}
          valueFieldName={`${field}.value`}
        />
        <ActionButton
          isQuiet
          aria-label="Remove row"
          onPress={fields.remove.bind(this, index)}
        >
          <Delete />
        </ActionButton>
      </Flex>
    ))}
    <View marginBottom="size-150">
      <Button variant="primary" onPress={() => fields.push({})}>
        <Add />
        <Text>Add Another</Text>
      </Button>
    </View>
  </Flex>
);

const ElementPropertiesEditor = () => (
  <FieldArray component={ElementPropertiesRenderer} name="elementProperties" />
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
      .filter((elementProperty) => elementProperty.name)
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
