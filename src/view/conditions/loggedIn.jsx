import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import Field from '../components/field';

const LoggedIn = () => (
  <label className="u-gapRight">
    <span className="u-label">Data element identifying whether the user is logged in</span>
    <Field
      name="dataElement"
      component={ Textfield }
      supportValidation
      supportDataElementName
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

export default extensionViewReduxForm(formConfig)(LoggedIn);
