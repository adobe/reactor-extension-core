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
import { CheckboxGroup, Checkbox } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import WrappedField from '../components/wrappedField';

const Domain = ({ domainOptions }) => (
  <WrappedField label="Domains" name="domains" component={CheckboxGroup}>
    {domainOptions.map((o) => (
      <Checkbox value={o} key={o}>
        {o}
      </Checkbox>
    ))}
  </WrappedField>
);

const stateToProps = (state) => ({
  domainOptions: state.meta.propertySettings
    ? state.meta.propertySettings.domains
    : []
});

export default connect(stateToProps)(Domain);

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
      domains: values.domains || [] // An array is required.
    };
  }
};
