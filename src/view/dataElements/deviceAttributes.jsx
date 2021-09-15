/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { Picker, Item } from '@adobe/react-spectrum';
import FullWidthField from '../components/fullWidthField';

const options = [
  {
    id: 'windowSize',
    name: 'Browser Window Size'
  },

  {
    id: 'screenSize',
    name: 'Screen Size'
  }
];

const DeviceAttributes = () => (
  <FullWidthField
    label="Attribute"
    name="attribute"
    component={Picker}
    items={options}
    containerMinWidth="size-6000"
    maxWidth="size-6000"
    minWidth="size-3000"
  >
    {(item) => <Item>{item.name}</Item>}
  </FullWidthField>
);

export default DeviceAttributes;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      attribute: settings.attribute || 'windowSize'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  }
};
