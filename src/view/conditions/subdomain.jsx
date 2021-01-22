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
import NoWrapText from '../components/noWrapText';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from './components/multipleItemEditor';

const renderItem = (field) => (
  <Flex data-row flex gap="size-100" alignItems="end">
    <NoWrapText>subdomain equals</NoWrapText>
    <View flex>
      <WrappedField
        label="Subdomain"
        name={`${field}.value`}
        width="100%"
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

const Subdomain = () => (
  <Flex gap="size-100" direction="column" minWidth="size-6000">
    <NoWrapText>Return true if</NoWrapText>
    <FieldArray
      name="subdomains"
      renderItem={renderItem}
      component={MultipleItemEditor}
    />
  </Flex>
);

export default Subdomain;

export const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.subdomains) {
      values.subdomains = [];
    }

    if (!values.subdomains.length) {
      values.subdomains.push({});
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    // We intentionally don't filter out empty values because a user may be attempting
    // to match no subdomain.
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const subdomainsErrors = (values.subdomains || []).map((subdomain) => {
      const result = {};

      if (!subdomain.value) {
        result.value = 'Please specify a subdomain.';
      }

      return result;
    });

    errors.subdomains = subdomainsErrors;

    return errors;
  }
};
