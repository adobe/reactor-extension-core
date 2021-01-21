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
import FullWidthField from '../components/fullWidthField';

export default () => (
  <FullWidthField
    beginText="Return true if the landing page equals"
    label="Page"
    name="page"
    regexName="pageIsRegex"
    regexValueFieldName="page"
    blankSpace={null}
    isRequired
    containerMinWidth="size-6000"
  />
);

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

    if (!values.page) {
      errors.page = 'Please specify a landing page.';
    }

    return errors;
  }
};
