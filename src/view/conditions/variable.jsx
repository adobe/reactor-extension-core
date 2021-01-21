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
import { Flex, TextField, View } from '@adobe/react-spectrum';
import InfoTip from '../components/infoTip';
import RegexToggle from '../components/regexToggle';
import WrappedField from '../components/wrappedField';
import NoWrapText from '../components/noWrapText';
import FullWidthField from '../components/fullWidthField';

const Variable = () => (
  <Flex gap="size-100" direction="column" minWidth="size-6000">
    <FullWidthField
      beginText="Return true if the JavaScript variable named"
      label="Variable name"
      name="name"
      minWidth="size-2400"
      placeholder="dataLayer.products.1.price"
      isRequired
      blankSpace={{
        width: 'size-2000',
        marginEnd: 'size-200',
        marginStart: 'size-115'
      }}
    />

    <Flex gap="size-100" alignItems="end">
      <NoWrapText>has the value</NoWrapText>
      <View flex>
        <WrappedField
          minWidth="size-4600"
          width="100%"
          label="Variable value"
          name="value"
          isRequired
          component={TextField}
        />
      </View>
      <View>
        <InfoTip className="u-gapRight" placement="bottom">
          Specify a text (string) value here. The rule will only fire if the
          specified variable contains this string. Note: If your variable
          contains a number, this will not work as expected.
        </InfoTip>
      </View>
      <WrappedField
        name="valueIsRegex"
        component={RegexToggle}
        valueFieldName="value"
      />
    </Flex>
  </Flex>
);

export default Variable;

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
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};
