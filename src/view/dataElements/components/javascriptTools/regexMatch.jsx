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
import { Flex, TextField, Checkbox } from '@adobe/react-spectrum';
import WrappedField from '../../../components/wrappedField';
import RegexTestButton from '../../../components/regexTestButton';
import operators from '../../utils/javascriptTools/operators';

export default ({ caseInsensitive }) => {
  return (
    <Flex gap="size-100">
      <WrappedField
        label="Regex Expression"
        name="regexInput"
        component={TextField}
        width="size-3000"
        isRequired
      />
      <WrappedField name="caseInsensitive" component={Checkbox}>
        Case Insensitive
      </WrappedField>
      <WrappedField
        name="regexInput"
        component={RegexTestButton}
        flags={caseInsensitive ? 'i' : ''}
      />
    </Flex>
  );
};

export const formConfig = {
  settingsToFormValues(values, { regexInput, caseInsensitive }) {
    values.regexInput = regexInput || '';
    values.caseInsensitive = caseInsensitive || false;

    return values;
  },
  formValuesToSettings(settings, { regexInput, caseInsensitive }) {
    if (
      [operators.REGEX_MATCH, operators.REGEX_REPLACE].includes(
        settings.operator
      )
    ) {
      settings.regexInput = regexInput;

      if (caseInsensitive) {
        settings.caseInsensitive = caseInsensitive;
      }
    }

    return settings;
  },
  validate(errors, { regexInput, operator }) {
    if (
      [operators.REGEX_MATCH, operators.REGEX_REPLACE].includes(operator) &&
      !regexInput
    ) {
      errors.regexInput = 'Please specify a regex expression';
    }

    return errors;
  }
};
