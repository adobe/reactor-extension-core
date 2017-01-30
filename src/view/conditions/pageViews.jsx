/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import { isNumber } from '../utils/validators';
import comparisonOperatorOptions from './comparisonOperatorOptions';

const PageViews = () => (
  <div>
    <div>
      <label className="u-gapRight">
        <span className="u-label">The user&apos;s number of page views is</span>
        <Field
          name="operator"
          component={ Select }
          options={ comparisonOperatorOptions }
        />
      </label>
      <label className="u-gapRight">
        <span className="u-label">the value</span>
        <Field
          name="count"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="u-smallTextfield"
        />
      </label>
      <span className="u-noWrap">
        <label>
          <span className="u-label">over</span>
        </label>
        <Field
          name="duration"
          component={ Radio }
          type="radio"
          value="lifetime"
        >
          Lifetime
        </Field>
        <Field
          name="duration"
          component={ Radio }
          type="radio"
          value="session"
        >
          Current Session
        </Field>
      </span>
    </div>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings,
      operator: settings.operator || '>',
      duration: settings.duration || 'lifetime'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      count: Number(values.count)
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!isNumber(values.count)) {
      errors.count = 'Please specify a number of page views.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(PageViews);
