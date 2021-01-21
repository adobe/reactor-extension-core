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
import { TextField, Flex, Text } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import { isInteger } from '../utils/validators';

const RandomNumber = () => (
  <Flex gap="size-100" alignItems="end" wrap minWidth="size-3000">
    <Text marginBottom="size-75">Generate a number that is between</Text>
    <WrappedField label="Minimum" name="min" component={TextField} isRequired />
    <Text marginBottom="size-75">and</Text>
    <WrappedField label="Maximum" name="max" component={TextField} isRequired />
  </Flex>
);

export default RandomNumber;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      min: settings.hasOwnProperty('min') ? settings.min : 0,
      max: settings.hasOwnProperty('max') ? settings.max : 1000000000
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      min: Number(values.min),
      max: Number(values.max)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.min === '' || !isInteger(Number(values.min))) {
      errors.min = 'Please specify a minimum integer.';
    }

    if (values.max === '' || !isInteger(Number(values.max))) {
      errors.max = 'Please specify a maximum integer.';
    }

    if (
      !errors.min &&
      !errors.max &&
      Number(values.min) >= Number(values.max)
    ) {
      errors.min = 'Please ensure that minimum is less than maximum.';
      errors.max = errors.min;
    }

    return errors;
  }
};
