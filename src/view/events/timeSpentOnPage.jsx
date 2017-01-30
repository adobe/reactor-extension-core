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
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';
import { isPositiveNumber } from '../utils/validators';

const TimeSpentOnPage = () => (
  <div>
    <label>
      <span className="u-label u-gapRight">Trigger after</span>
    </label>
    <Field
      name="timeOnPage"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
    <label>
      <span className="u-label u-gapLeft">seconds spent on the page</span>
    </label>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings: (settings, values) => ({
    ...settings,
    timeOnPage: Number(values.timeOnPage)
  }),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!isPositiveNumber(values.timeOnPage)) {
      errors.timeOnPage = 'Please specify a positive number';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TimeSpentOnPage);
