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
import {
  Radio,
  RadioGroup,
  TextField,
  Flex,
  View
} from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from '../../components/wrappedField';

import {
  isNumberLikeInRange,
  isDataElementToken
} from '../../utils/validators';

const DelayType = ({ delayType }) => (
  <View>
    <WrappedField name="delayType" label="Trigger" component={RadioGroup}>
      <Radio value="immediate">immediately</Radio>
      <Radio value="delay">after a delay</Radio>
    </WrappedField>

    {delayType === 'delay' && (
      <Flex alignItems="end" gap="size-100">
        <WrappedField
          name="delay"
          component={TextField}
          label="Delay"
          isRequired
          supportDataElement
        />
        <View marginBottom="size-75">milliseconds</View>
      </Flex>
    )}
  </View>
);

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
  delayType: valueSelector(state, 'delayType')
});

export default connect(stateToProps)(DelayType);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      delayType: settings.delay > 0 ? 'delay' : 'immediate',
      delay: settings.delay > 0 ? settings.delay : ''
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    if (values.delayType === 'delay') {
      settings.delay = Number(values.delay);
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (
      values.delayType === 'delay' &&
      !isNumberLikeInRange(values.delay, { min: 1 }) &&
      !isDataElementToken(values.delay)
    ) {
      errors.delay =
        'Please specify a number greater than or equal to 1, or specify a data element.';
    }

    return errors;
  }
};
