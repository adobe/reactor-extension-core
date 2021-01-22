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
import { Flex, Checkbox } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import FullWidthField from '../components/fullWidthField';

const QueryStringParameter = () => (
  <Flex direction="column" gap="size-100">
    <FullWidthField
      label="URL Query String Parameter Name"
      name="name"
      containerMinWidth="size-6000"
      isRequired
    />

    <WrappedField name="caseInsensitive" component={Checkbox}>
      Allow capitalization differences (case-insensitive)
    </WrappedField>
  </Flex>
);

export default QueryStringParameter;

export const formConfig = {
  settingsToFormValues(values, settings, state) {
    return {
      ...values,
      ...settings,
      caseInsensitive: state.meta.isNew || settings.caseInsensitive
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
      errors.name = 'Please specify a query string parameter name.';
    }

    return errors;
  }
};
