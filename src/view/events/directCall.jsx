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
import { TextField, Flex, View } from '@adobe/react-spectrum';
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';

const DirectCall = () => (
  <Flex alignItems="end" gap="size-100" minWidth="size-6000">
    <View flex>
      <WrappedField
        width="100%"
        label="Identifier"
        name="identifier"
        isRequired
        component={TextField}
      />
    </View>
    <InfoTip placement="bottom">
      Specify the string that will be passed to _satellite.track() in your
      direct call, without quotes.
    </InfoTip>
    <View width="size-1200" />
  </Flex>
);

export default DirectCall;

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

    if (!values.identifier) {
      errors.identifier = 'Please specify an identifier.';
    }

    return errors;
  }
};
