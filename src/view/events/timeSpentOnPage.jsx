import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { isPositiveNumber } from '../utils/validators';

const TimeSpentOnPage = () => (
  <div>
    <label>
      <span className="u-label u-gapRight">Trigger after</span>
    </label>
    <CoralField
      name="timeOnPage"
      component={ Textfield }
      supportValidation
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
