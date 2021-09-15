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
import { TextField, Flex, Checkbox } from '@adobe/react-spectrum';
import WrappedField from '../../../components/wrappedField';
import operators from '../../utils/javascriptTools/operators';

export default () => (
  <Flex gap="size-100">
    <WrappedField
      label="Replacement Value"
      name="replacementValue"
      component={TextField}
      width="size-3000"
      supportDataElement
    />
    <WrappedField minWidth="size-2000" name="replaceAll" component={Checkbox}>
      Replace all
    </WrappedField>
  </Flex>
);

export const formConfig = {
  settingsToFormValues(values, { replacementValue, replaceAll }) {
    values.replacementValue = replacementValue || '';
    values.replaceAll = replaceAll || false;

    return values;
  },
  formValuesToSettings(settings, { replacementValue, replaceAll }) {
    if (
      [operators.SIMPLE_REPLACE, operators.REGEX_REPLACE].includes(
        settings.operator
      )
    ) {
      if (replacementValue) {
        settings.replacementValue = replacementValue;
      }

      if (replaceAll) {
        settings.replaceAll = replaceAll;
      }
    }

    return settings;
  },
  validate(errors) {
    return errors;
  }
};
