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
import { Picker, Flex, Item } from '@adobe/react-spectrum';
import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';
import FullWidthField from '../components/fullWidthField';

const Sessions = () => (
  <Flex direction="column" gap="size-100" minWidth="size-6000">
    <FullWidthField
      beginText="The user's number of sessions is"
      label="Operator"
      name="operator"
      component={Picker}
      items={comparisonOperatorOptions}
    >
      {(item) => <Item>{item.name}</Item>}
    </FullWidthField>
    <FullWidthField
      beginText="the value"
      label="Count"
      name="count"
      isRequired
    />
  </Flex>
);

export default Sessions;

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
      count: Number(values.count)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumberLike(values.count)) {
      errors.count = 'Please specify a number of sessions.';
    }

    return errors;
  }
};
