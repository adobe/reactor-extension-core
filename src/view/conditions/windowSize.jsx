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
  Text,
  Flex,
  Picker,
  Item,
  TextField,
  View
} from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import { isNumberLike } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';
import NoWrapText from '../components/noWrapText';

const WindowSize = () => (
  <Flex gap="size-100" direction="column" minWidth="size-6000">
    <Flex alignItems="end" gap="size-100">
      <Text marginBottom="size-75">
        Return true if the user&rsquo;s window size width is
      </Text>
      <WrappedField
        label="Operator"
        name="widthOperator"
        component={Picker}
        items={comparisonOperatorOptions}
      >
        {(item) => <Item>{item.name}</Item>}
      </WrappedField>
      <View flex>
        <WrappedField
          label="Width"
          name="width"
          component={TextField}
          width="100%"
          minWidth="size-1200"
          isRequired
        />
      </View>
      <NoWrapText>px</NoWrapText>
    </Flex>
    <Flex alignItems="end" gap="size-100">
      <NoWrapText>and height is</NoWrapText>
      <WrappedField
        label="Operator"
        name="heightOperator"
        component={Picker}
        items={comparisonOperatorOptions}
      >
        {(item) => <Item>{item.name}</Item>}
      </WrappedField>
      <View flex>
        <WrappedField
          label="Height"
          name="height"
          component={TextField}
          width="100%"
          minWidth="size-1200"
          isRequired
        />
      </View>
      <NoWrapText>px</NoWrapText>
    </Flex>
  </Flex>
);

export default WindowSize;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      widthOperator: settings.widthOperator || '>',
      heightOperator: settings.heightOperator || '>'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      width: Number(values.width),
      height: Number(values.height)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumberLike(values.width)) {
      errors.width = 'Please specify a number for width.';
    }

    if (!isNumberLike(values.height)) {
      errors.height = 'Please specify a number for height.';
    }

    return errors;
  }
};
