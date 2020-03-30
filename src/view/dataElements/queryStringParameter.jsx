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
import Checkbox from '@react/react-spectrum/Checkbox';
import Textfield from '@react/react-spectrum/Textfield';
import WrappedField from '../components/wrappedField';
import TooltipPlaceholder from '../components/tooltipPlaceholder';

const QueryStringParameter = () => (
  <div>
    <label className="u-gapRight u-alignItemsCenter u-flex">
      <span className="u-gapRight">URL Query String Parameter Name</span>
      <WrappedField
        className="u-flexOne"
        name="name"
        component={Textfield}
        componentClassName="u-fullWidth u-minFieldWidth"
      />
      <TooltipPlaceholder />
    </label>
    <WrappedField
      name="caseInsensitive"
      component={Checkbox}
    >
      Allow capitalization differences (case-insensitive)
    </WrappedField>
  </div>
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
