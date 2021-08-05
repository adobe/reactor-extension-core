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
import { Flex, TextField, View } from '@adobe/react-spectrum';
import { FieldArray } from 'redux-form';
import WrappedField from '../components/wrappedField';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from '../components/multipleItemEditor';
import NoWrapText from '../components/noWrapText';

const createItem = () => ({});

const renderItem = (field) => (
  <Flex data-row flex gap="size-100" alignItems="end">
    <NoWrapText>path equals</NoWrapText>
    <View flex>
      <WrappedField
        label="Path"
        width="100%"
        name={`${field}.value`}
        component={TextField}
        isRequired
      />
    </View>

    <WrappedField
      name={`${field}.valueIsRegex`}
      component={RegexToggle}
      valueFieldName={`${field}.value`}
    />
  </Flex>
);

const PathAndQueryString = () => (
  <Flex gap="size-100" direction="column" minWidth="size-6000">
    <NoWrapText>Return true if</NoWrapText>
    <FieldArray
      name="paths"
      renderItem={renderItem}
      component={MultipleItemEditor}
      interstitialLabel="OR"
      createItem={createItem}
    />
  </Flex>
);

export default PathAndQueryString;

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.paths) {
      values.paths = [];
    }

    if (!values.paths.length) {
      values.paths.push(createItem());
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    // We intentionally don't filter out empty values because a user may be attempting
    // to match an empty path.
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const pathsErrors = (values.paths || []).map((path) => {
      const result = {};

      if (!path.value) {
        result.value = 'Please specify a path.';
      }

      return result;
    });

    errors.paths = pathsErrors;

    return errors;
  }
};
