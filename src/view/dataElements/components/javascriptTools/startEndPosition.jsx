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
import { TextField, Flex } from '@adobe/react-spectrum';
import WrappedField from '../../../components/wrappedField';
import { isNumberLike } from '../../../utils/validators';
import operators from '../../utils/javascriptTools/operators';

export default () => (
  <Flex gap="size-100">
    <WrappedField
      label="Start Position"
      name="start"
      component={TextField}
      width="size-1000"
    />
    <WrappedField
      label="End Position"
      name="end"
      component={TextField}
      width="size-1000"
    />
  </Flex>
);

export const formConfig = {
  settingsToFormValues(values, { start, end }) {
    values.start = start || '';
    values.end = end || '';

    return values;
  },
  formValuesToSettings(settings, { start, end }) {
    if ([operators.SUBSTRING, operators.SLICE].includes(settings.operator)) {
      settings.start = Number(start);

      if (end) {
        settings.end = Number(end);
      }
    }

    return settings;
  },
  validate(errors, { start, end, operator }) {
    if ([operators.SUBSTRING, operators.SLICE].includes(operator)) {
      if (!start || !isNumberLike(start)) {
        errors.start = 'Please specify a number';
      }
    }

    if (end && !isNumberLike(end)) {
      errors.end = 'Please specify a number';
    }

    return errors;
  }
};
