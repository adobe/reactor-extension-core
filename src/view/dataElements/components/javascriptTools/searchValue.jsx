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
import { TextField } from '@adobe/react-spectrum';
import WrappedField from '../../../components/wrappedField';
import operators from '../../utils/javascriptTools/operators';

export default () => (
  <WrappedField
    label="Search Value"
    name="searchValue"
    component={TextField}
    width="size-3000"
    supportDataElement
  />
);

export const formConfig = {
  settingsToFormValues(values, { searchValue }) {
    values.searchValue = searchValue || '';
    return values;
  },
  formValuesToSettings(settings, { searchValue }) {
    if (
      [
        operators.SIMPLE_REPLACE,
        operators.INDEX_OF,
        operators.LAST_INDEX_OF
      ].includes(settings.operator)
    ) {
      settings.searchValue = searchValue;
    }

    return settings;
  },
  validate(errors, { searchValue, operator }) {
    if (
      [
        operators.SIMPLE_REPLACE,
        operators.INDEX_OF,
        operators.LAST_INDEX_OF
      ].includes(operator) &&
      !searchValue
    ) {
      errors.searchValue = 'Please specify a value to search for';
    }

    return errors;
  }
};
