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
import { TextField, Flex } from '@adobe/react-spectrum';
import ValueComparison, {
  formConfig as valueComparisonFormConfig
} from '../conditions/valueComparison';
import WrappedField from '../components/wrappedField';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const ConditionalField = () => {
  return (
    <>
      <WrappedField
        label="If true, return this string value"
        name="conditionalValue"
        placeholder="Value if true"
        width="size-3000"
        component={TextField}
        supportDataElement
        isRequired
      />
    </>
  );
};

const FallbackField = () => {
  return (
    <>
      <WrappedField
        label="Otherwise, return this string value"
        name="fallbackValue"
        placeholder="Value if false"
        width="size-3000"
        component={TextField}
        supportDataElement
      />
    </>
  );
};

const ConditionalValue = () => (
  <Flex gap="size-100" direction="column">
    <ValueComparison label="Compare two values and return a value based on the result" />
    <ConditionalField />
    <FallbackField />
  </Flex>
);

export default ConditionalValue;

export const formConfig = mergeFormConfigs(valueComparisonFormConfig, {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      conditionalValue: settings.conditionalValue || '',
      fallbackValue: settings.fallbackValue || ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      conditionalValue: values.conditionalValue,
      fallbackValue: values.fallbackValue
    };

    return settings;
  },
  validate(errors, values) {
    if (!values.conditionalValue) {
      errors.conditionalValue = 'Please specify a value or data element';
    }

    return errors;
  }
});
