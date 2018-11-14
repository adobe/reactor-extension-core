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

/*eslint no-restricted-globals: 0*/
import React from 'react';
import { formValueSelector, getFormInitialValues } from 'redux-form';
import { connect } from 'react-redux';
import { Toast } from '@react/react-spectrum/Toast';
import Textfield from '@react/react-spectrum/Textfield';
import Checkbox from '@react/react-spectrum/Checkbox';
import InfoTip from '../components/infoTip';
import WrappedField from '../components/wrappedField';

const Sampling = ({ showCohortResetInfo }) => (
  <div>
    <div>
      <label>
        <span className="u-verticalAlignMiddle u-gapRight">Return true</span>
        <WrappedField
          name="rate"
          component={Textfield}
          componentClassName="u-smallTextfield"
        />
        <span className="u-verticalAlignMiddle u-gapRight u-gapLeft">percent of the time.</span>
      </label>
    </div>
    <div className="u-gapTop">
      <WrappedField
        name="persistCohort"
        component={Checkbox}
        label="Persist cohort"
        componentClassName="u-noPaddingRight"
      />
      <InfoTip className="u-noPadding">
        If the condition returns true the first time it is run for a given user it will return
        true on subsequent runs of the condition for the same user and vice versa.
      </InfoTip>
      {
        showCohortResetInfo ?
          (
            <Toast variant="warning">
              Changing the sampling value will reset the cohort the next time the rule is published.
            </Toast>
          ) : null
      }
    </div>
  </div>
);

const valueSelector = formValueSelector('default');
const initialValuesSelector = getFormInitialValues('default');
const stateToProps = (state) => {
  const initialValues = initialValuesSelector(state);
  return ({
    showCohortResetInfo: !state.meta.isNew &&
      valueSelector(state, 'persistCohort') &&
      initialValues.persistCohort &&
      valueSelector(state, 'rate') !== initialValues.rate
  });
};

export default connect(stateToProps)(Sampling);

export const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      // The only reason we round and only allow integers in the input is because it's the
      // simplest way to deal with floating point precision issues. For example, if the user
      // had a rate of .544, then we were to multiply by 100, it would end up showing
      // 54.400000000000006 in the input field. If we need to support more granularity, we can, as
      // long as we solve for the floating point issue.
      rate: String(settings.hasOwnProperty('rate') ? Math.round(settings.rate * 100) : 50),
      persistCohort: Boolean(settings.persistCohort)
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      rate: Number(values.rate) / 100
    };

    if (values.persistCohort) {
      settings.persistCohort = true;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.rate === '' ||
      isNaN(values.rate) ||
      Number(values.rate) < 0 ||
      Number(values.rate) > 100 ||
      Number(values.rate) !== Math.round(Number(values.rate))) {
      errors.rate = 'Please specify an integer between 0 and 100.';
    }

    return errors;
  }
};
