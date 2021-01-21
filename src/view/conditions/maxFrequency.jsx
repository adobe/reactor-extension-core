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
import { TextField, Picker, Item, Flex } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from '../components/wrappedField';
import NoWrapText from '../components/noWrapText';

import { isNumberLikeInRange } from '../utils/validators';

const VISITOR = 'visitor';
const PAGE_VIEW = 'pageView';

const unitOptions = [
  {
    name: 'page views',
    id: PAGE_VIEW
  },
  {
    name: 'sessions',
    id: 'session'
  },
  {
    name: 'visitor',
    id: VISITOR
  },
  {
    name: 'seconds',
    id: 'second'
  },
  {
    name: 'minutes',
    id: 'minute'
  },
  {
    name: 'days',
    id: 'day'
  },
  {
    name: 'weeks',
    id: 'week'
  },
  {
    name: 'months',
    id: 'month'
  }
];

const MaxFrequency = ({ unit }) => (
  <Flex gap="size-100" alignItems="end" minWidth="size-6000" wrap>
    <NoWrapText>Return true no more than once every</NoWrapText>
    {unit !== VISITOR ? (
      <WrappedField
        label="Count"
        name="count"
        component={TextField}
        isRequired
      />
    ) : null}
    <WrappedField
      label="Unit"
      name="unit"
      component={Picker}
      items={unitOptions}
    >
      {(item) => <Item>{item.name}</Item>}
    </WrappedField>
  </Flex>
);

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
  unit: valueSelector(state, 'unit')
});

export default connect(stateToProps)(MaxFrequency);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      count: String(settings.count || 1),
      unit: settings.unit || PAGE_VIEW
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      unit: values.unit
    };

    if (values.unit !== VISITOR) {
      settings.count = Number(values.count);
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (
      values.unit !== VISITOR &&
      !isNumberLikeInRange(values.count, { min: 1 })
    ) {
      errors.count = 'Please specify a number greater than or equal to 1.';
    }

    return errors;
  }
};
