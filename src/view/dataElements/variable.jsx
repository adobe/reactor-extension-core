import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import CoralField from '../components/coralField';

const Variable = () => (
  <label>
    <span className="u-label">Path to variable</span>
    <CoralField
      name="path"
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

    if (!values.path) {
      errors.path = 'Please specify a variable path.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
