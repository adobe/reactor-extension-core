/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Select from '@coralui/redux-form-react-coral/lib/Select';

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
    <span className="u-label">Attribute</span>
    <Field
      name="attribute"
      component={ DecoratedInput }
      inputComponent={ Select }
      options={ options }
      backspaceRemoves={ false }
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
