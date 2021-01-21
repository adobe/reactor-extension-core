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
import { Picker, TextField, Item, Flex } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';
import NoWrapText from '../components/noWrapText';

const TimeOnSite = () => (
  <Flex gap="size-100" minWidth="size-6000" alignItems="end" wrap>
    <NoWrapText>User has spent</NoWrapText>
    <WrappedField
      label="Operator"
      name="operator"
      component={Picker}
      items={comparisonOperatorOptions}
    >
      {(item) => <Item>{item.name}</Item>}
    </WrappedField>
    <Flex gap="size-100" alignItems="end">
      <WrappedField
        label="Minutes"
        name="minutes"
        component={TextField}
        isRequired
      />

      <NoWrapText>minutes on site</NoWrapText>
    </Flex>
  </Flex>
);

export default TimeOnSite;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      minutes: Number(values.minutes)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumberLike(values.minutes)) {
      errors.minutes = 'Please specify a positive number of minutes.';
    }

    return errors;
  }
};
