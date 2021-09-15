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
import { connect } from 'react-redux';
import { TextField, Picker, Item, Flex } from '@adobe/react-spectrum';
import { formValueSelector } from 'redux-form';
import WrappedField from '../components/wrappedField';
import NoWrapText from '../components/noWrapText';
import { isDataElementToken } from '../utils/validators';
import operators from './utils/javascriptTools/operators';
import metaByOperator from './utils/javascriptTools/metaByOperator';
import { formConfig as simpleReplaceFormConfig } from './components/javascriptTools/simpleReplace';
import { formConfig as regexReplaceFormConfig } from './components/javascriptTools/regexReplace';
import { formConfig as startEndPositionFormConfig } from './components/javascriptTools/startEndPosition';
import { formConfig as valuesSeparatorFormConfig } from './components/javascriptTools/valueSeparator';
import { formConfig as searchValueFormConfig } from './components/javascriptTools/searchValue';
import mergeFormConfigs from '../utils/mergeFormConfigs';

const operatorOptions = Object.keys(metaByOperator).map((operator) => ({
  id: operator,
  name: metaByOperator[operator].label
}));

const JSTools = ({ operator, ...rest }) => {
  const extraFieldComponentFn = metaByOperator[operator].componentFn;

  return (
    <Flex gap="size-100" direction="column">
      <NoWrapText>On data element</NoWrapText>

      <WrappedField
        minWidth="size-3000"
        label="Data Element"
        name="sourceValue"
        component={TextField}
        isRequired
        supportDataElement
      />

      <NoWrapText marginTop="size-75">apply the transformation</NoWrapText>

      <WrappedField
        width="size-3000"
        name="operator"
        label="Function"
        component={Picker}
        items={operatorOptions}
      >
        {(item) => <Item>{item.name}</Item>}
      </WrappedField>

      {extraFieldComponentFn && extraFieldComponentFn({ ...rest })}
    </Flex>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = (state) =>
  valueSelector(state, 'operator', 'caseInsensitive');

export default connect(stateToProps)(JSTools);

export const formConfig = mergeFormConfigs(
  {
    settingsToFormValues(values, settings) {
      return {
        ...values,
        sourceValue: settings.sourceValue || '',
        operator: settings.operator || operators.SIMPLE_REPLACE
      };
    },
    formValuesToSettings(settings, values) {
      settings = {
        ...settings,
        sourceValue: values.sourceValue,
        operator: values.operator
      };

      return settings;
    },
    validate(errors, values) {
      if (!isDataElementToken(values.sourceValue)) {
        errors.sourceValue = 'Please specify a data element';
      }

      return errors;
    }
  },

  simpleReplaceFormConfig,
  regexReplaceFormConfig,
  startEndPositionFormConfig,
  valuesSeparatorFormConfig,
  searchValueFormConfig
);
