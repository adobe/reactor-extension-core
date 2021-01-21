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
import { Flex, TextField, View, Picker, Item } from '@adobe/react-spectrum';
import WrappedField from '../components/wrappedField';
import ElementFilter, {
  formConfig as elementFilterFormConfig
} from './components/elementFilter';
import AdvancedEventOptions, {
  formConfig as advancedEventOptionsFormConfig
} from './components/advancedEventOptions';
import { isNumberLikeInRange } from '../utils/validators';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import NoWrapText from '../components/noWrapText';

const timePlayedUnit = {
  SECOND: 'second',
  PERCENT: 'percent'
};

const timePlayedUnitOptions = [
  {
    id: timePlayedUnit.SECOND,
    name: 'seconds'
  },
  {
    id: timePlayedUnit.PERCENT,
    name: 'percent'
  }
];

const label = 'When media has been played for a specified amount of time on';

const MediaTimePlayed = () => (
  <>
    <ElementFilter elementSpecificityLabel={label} />
    <Flex
      alignItems="end"
      gap="size-100"
      marginBottom="size-100"
      minWidth="size-6000"
      wrap
    >
      <NoWrapText>Trigger when</NoWrapText>
      <WrappedField
        name="amount"
        label="Amount"
        isRequired
        component={TextField}
      />
      <Flex alignItems="end" gap="size-100">
        <WrappedField
          name="unit"
          label="Units"
          component={Picker}
          items={timePlayedUnitOptions}
        >
          {(item) => <Item>{item.name}</Item>}
        </WrappedField>
        <NoWrapText>have passed</NoWrapText>
      </Flex>
    </Flex>
    <AdvancedEventOptions />
  </>
);

export default MediaTimePlayed;

export const formConfig = mergeFormConfigs(
  elementFilterFormConfig,
  advancedEventOptionsFormConfig,
  {
    settingsToFormValues: (values, settings) => ({
      ...values,
      unit: settings.unit || timePlayedUnit.SECOND
    }),
    formValuesToSettings: (settings, values) => ({
      ...settings,
      unit: values.unit,
      amount: Number(values.amount)
    }),
    validate: (errors, values) => {
      errors = {
        ...errors
      };

      if (
        !isNumberLikeInRange(values.amount, { min: 0, minInclusive: false })
      ) {
        errors.amount = 'Please specify a positive number';
      }

      return errors;
    }
  }
);
