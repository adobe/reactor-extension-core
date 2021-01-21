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
import { RadioGroup, Radio, Flex } from '@adobe/react-spectrum';
import SpecificElements, {
  formConfig as specificElementsFormConfig
} from './components/specificElements';
import DelayType, {
  formConfig as delayTypeFormConfig
} from './components/delayType';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import WrappedField from '../components/wrappedField';

const EntersViewport = () => (
  <Flex gap="size-100" direction="column">
    <SpecificElements />
    <DelayType />

    <WrappedField
      label="at the frequency of"
      name="frequency"
      component={RadioGroup}
    >
      <Radio value="firstEntry">first time element enters viewport</Radio>
      <Radio value="everyEntry">every time element enters viewport</Radio>
    </WrappedField>
  </Flex>
);

export default EntersViewport;

export const formConfig = mergeFormConfigs(
  specificElementsFormConfig,
  delayTypeFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      frequency: settings.frequency || 'firstEntry'
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      frequency: values.frequency
    })
  }
);
