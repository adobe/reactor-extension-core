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
import { Flex } from '@adobe/react-spectrum';
import WarningContainer from '../components/warningContainer';
import FullWidthField from '../components/fullWidthField';

const DataElementChange = () => (
  <Flex direction="column" gap="size-100" minWidth="size-6000">
    <WarningContainer>
      This event type polls the data element value to determine if it has
      changed. If your rule is time-sensitive, we recommend using other event
      types (e.g., Custom Event, Direct Call) to manually fire the rule
      immediately after you have made data element value changes.
    </WarningContainer>

    <FullWidthField
      label="Data Element Name"
      name="name"
      isRequired
      supportDataElementName
    />
  </Flex>
);

export default DataElementChange;

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
    if (!values.name) {
      errors = {
        ...errors,
        name: 'Please specify a data element name.'
      };
    }

    return errors;
  }
};
