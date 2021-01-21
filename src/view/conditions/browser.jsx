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
import { Checkbox, CheckboxGroup } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';

const browserOptions = [
  'Chrome',
  'Firefox',
  'IE',
  'Edge',
  'Safari',
  'Mobile Safari'
];

const Browser = () => (
  <WrappedField label="Browsers" name="browsers" component={CheckboxGroup}>
    {browserOptions.map((o) => (
      <Checkbox value={o} key={o}>
        {o}
      </Checkbox>
    ))}
  </WrappedField>
);

export default Browser;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      browsers: settings.browsers
        ? // We have to take into consideration browser options that previously existed.
          // If a user saved the condition using those options, we filter them out here.
          settings.browsers.filter(
            (browser) => browserOptions.indexOf(browser) !== -1
          )
        : []
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  }
};
