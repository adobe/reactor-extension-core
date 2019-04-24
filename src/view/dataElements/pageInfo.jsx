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
import Select from '@react/react-spectrum/Select';
import WrappedField from '../components/wrappedField';

const options = [
  {
    value: 'url',
    label: 'URL'
  },
  {
    value: 'hostname',
    label: 'Hostname'
  },
  {
    value: 'pathname',
    label: 'Pathname'
  },
  {
    value: 'protocol',
    label: 'Protocol'
  },
  {
    value: 'referrer',
    label: 'Referrer'
  },
  {
    value: 'title',
    label: 'Title'
  }
];

const PageInfo = () => (
  <label>
    <span className="u-verticalAlignMiddle u-gapRight">Attribute</span>
    <WrappedField
      name="attribute"
      component={Select}
      options={options}
    />
  </label>
);

export default PageInfo;

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      attribute: settings.attribute || 'url'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  }
};
