import React from 'react';

import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';
import Field from '../components/field';

const DirectCall = () => (
  <label>
    <span className="u-label">_satellite.track string</span>
    <Field
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
      errors.name = 'Please specify a rule name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DirectCall);
