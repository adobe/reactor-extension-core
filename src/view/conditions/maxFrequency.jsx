/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
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
import { connect } from 'react-redux';
import Textfield from '@react/react-spectrum/Textfield';
import Select from '@react/react-spectrum/Select';
import { formValueSelector } from 'redux-form';
import WrappedField from '../components/wrappedField';

import { isNumberLikeInRange } from '../utils/validators';

const VISITOR = 'visitor';
const PAGE_VIEW = 'pageView';

const unitOptions = [
  {
    label: 'page views',
    value: PAGE_VIEW
  },
  {
    label: 'sessions',
    value: 'session'
  },
  {
    label: 'visitor',
    value: VISITOR
  },
  {
    label: 'seconds',
    value: 'second'
  },
  {
    label: 'minutes',
    value: 'minute'
  },
  {
    label: 'days',
    value: 'day'
  },
  {
    label: 'weeks',
    value: 'week'
  },
  {
    label: 'months',
    value: 'month'
  }
];

const MaxFrequency = ({ unit }) => (
  <div>
    <span className="u-verticalAlignMiddle u-gapRight">
      Return true no more than once every
    </span>
    {
      unit !== VISITOR ?
        (
          <WrappedField
            name="count"
            component={Textfield}
            className="u-gapRight"
            componentClassName="u-smallTextfield"
          />
        ) : null
    }
    <WrappedField
      name="unit"
      component={Select}
      options={unitOptions}
    />
  </div>
);

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
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

    if (values.unit !== VISITOR &&
      (!isNumberLikeInRange(values.count, { min: 1 }))) {
      errors.count = 'Please specify a number greater than or equal to 1.';
    }

    return errors;
  }
};
