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
import { CheckboxGroup, Checkbox, Flex } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import WarningContainer from '../components/warningContainer';

const deviceTypeOptions = [
  'Desktop',
  'iPhone',
  'iPad',
  'iPod',
  'Nokia',
  'Windows Phone',
  'Blackberry',
  'Android'
];

const DeviceType = () => (
  <Flex gap="size-100" direction="column">
    <WarningContainer>
      This condition type is no longer supported. Please avoid its use.
    </WarningContainer>

    <WrappedField
      label="Device Types"
      name="deviceTypes"
      component={CheckboxGroup}
    >
      {deviceTypeOptions.map((o) => (
        <Checkbox value={o} key={o}>
          {o}
        </Checkbox>
      ))}
    </WrappedField>
  </Flex>
);

export default DeviceType;

export const formConfig = {
  settingsToFormValues(values, settings) {
    const initialState = { deviceTypes: [] };
    return {
      ...initialState,
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      deviceTypes: values.deviceTypes || [] // An array is required.
    };
  }
};
