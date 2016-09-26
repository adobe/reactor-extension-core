import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import Field from '../components/field';
import extensionViewReduxForm from '../extensionViewReduxForm';

const RegisteredUser = () => (
  <label>
    <span className="u-label">
      Data element identifying whether the user is registered
    </span>
    <Field
      name="dataElement"
      component={ Textfield }
      supportDataElementName
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

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(RegisteredUser);
