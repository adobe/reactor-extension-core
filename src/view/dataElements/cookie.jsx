import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';

const Cookie = () => (
  <label>
    <span className="u-label">Cookie Name</span>
    <CoralField
      name="name"
      component={ Textfield }
      supportValidation
    />
  </label>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a cookie name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Cookie);
