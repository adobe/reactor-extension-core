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
import { FieldArray } from 'redux-form';
import { Flex, TextField, View } from '@adobe/react-spectrum';
import NoWrapText from '../components/noWrapText';
import WrappedField from '../components/wrappedField';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from '../components/multipleItemEditor';

const createItem = () => ({});

const renderItem = (field) => (
  <Flex data-row flex gap="size-100" alignItems="end">
    <NoWrapText>traffic source equals</NoWrapText>
    <View flex>
      <WrappedField
        label="Value"
        width="100%"
        name={`${field}.value`}
        component={TextField}
        isRequired
      />
    </View>

    <WrappedField
      name={`${field}.sourceIsRegex`}
      component={RegexToggle}
      valueFieldName={`${field}.value`}
    />
  </Flex>
);

export default () => (
  <Flex direction="column" gap="size-100" minWidth="size-6000">
    <NoWrapText>Return true when</NoWrapText>
    <FieldArray
      name="source"
      renderItem={renderItem}
      component={MultipleItemEditor}
      interstitialLabel="OR"
      createItem={createItem}
    />
  </Flex>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    /** backwards compat changes **/
    // historically, settings.source was a simple string, and we could only compare
    // against one traffic source value. This component was changed to support many
    // traffic source values to compare against, but we provide an "upgrade path" here.
    if (!Array.isArray(values.source)) {
      values.source = [];
      if (typeof settings.source === 'string') {
        values.source.push({
          value: settings.source,
          sourceIsRegex: Boolean(settings.sourceIsRegex)
        });
      } else {
        values.source.push(createItem());
      }
    }
    delete values.sourceIsRegex;
    /** end backwards compat changes **/

    return values;
  },
  formValuesToSettings(settings, values) {
    /** legacy top level keys **/
    delete settings.sourceIsRegex;
    /** end legacy top level keys **/

    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    // values.source is now an array
    errors.source = (values.source || []).map((trafficSource) => {
      const result = {};
      if (!trafficSource.value) {
        result.value = 'Please specify a traffic source.';
      }
      return result;
    });

    return errors;
  }
};
