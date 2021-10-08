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
import { TextField, Flex, Checkbox, View } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import ValueComparison, {
  formConfig as valueComparisonFormConfig
} from '../conditions/valueComparison';
import WrappedField from '../components/wrappedField';
import InfoTip from '../components/infoTip';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import { isNumberLike } from '../utils/validators';

const ReturnField = ({
  shouldReturnValue,
  checkboxName,
  checkboxLabel,
  inputName,
  inputLabel,
  inputPlaceholder
}) => {
  return (
    <>
      <Flex alignItems="center">
        <WrappedField name={checkboxName} component={Checkbox}>
          {checkboxLabel}
        </WrappedField>
        <View position="relative" left="-1rem">
          <InfoTip>
            No value will be returned when this option is not checked. If it is
            checked and the input is empty then an empty string will be
            returned.
          </InfoTip>
        </View>
      </Flex>
      {shouldReturnValue && (
        <WrappedField
          label={inputLabel}
          name={inputName}
          placeholder={inputPlaceholder}
          width="size-3000"
          component={TextField}
          supportDataElement
        />
      )}
    </>
  );
};

const ConditionalValue = ({ returnConditionalValue, returnFallbackValue }) => (
  <Flex gap="size-100" direction="column">
    <ValueComparison label="Compare two values and return a value based on the result" />

    <ReturnField
      shouldReturnValue={returnConditionalValue}
      checkboxName="returnConditionalValue"
      checkboxLabel="Return conditional value"
      inputLabel="If true, return this value"
      inputName="conditionalValue"
      inputPlaceholder="Value if true"
    />

    <ReturnField
      shouldReturnValue={returnFallbackValue}
      checkboxName="returnFallbackValue"
      checkboxLabel="Return fallback value"
      inputLabel="Otherwise, return this value"
      inputName="fallbackValue"
      inputPlaceholder="Value if false"
    />
  </Flex>
);

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
  returnConditionalValue: valueSelector(state, 'returnConditionalValue'),
  returnFallbackValue: valueSelector(state, 'returnFallbackValue')
});

export default connect(stateToProps)(ConditionalValue);

export const formConfig = mergeFormConfigs(valueComparisonFormConfig, {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      returnConditionalValue: settings.conditionalValue != null || true,
      conditionalValue:
        settings.conditionalValue != null ? settings.conditionalValue : '',
      returnFallbackValue: settings.fallbackValue != null || false,
      fallbackValue:
        settings.fallbackValue != null ? settings.fallbackValue : ''
    };
  },
  formValuesToSettings(settings, values) {
    if (values.returnConditionalValue) {
      settings.conditionalValue = isNumberLike(values.conditionalValue)
        ? Number(values.conditionalValue)
        : values.conditionalValue;
    }

    if (values.returnFallbackValue) {
      settings.fallbackValue = isNumberLike(values.fallbackValue)
        ? Number(values.fallbackValue)
        : values.fallbackValue;
    }

    return settings;
  },
  validate(errors) {
    return errors;
  }
});
