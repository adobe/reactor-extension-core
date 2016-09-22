import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import extensionViewReduxForm from '../extensionViewReduxForm';

function Variable({ ...props }) {
  const { path } = props.fields;

  return (
    <ValidationWrapper error={ path.touched && path.error }>
      <label>
        <span className="u-label">Path to variable</span>
        <Textfield { ...path } />
      </label>
    </ValidationWrapper>
  );
}

const formConfig = {
  fields: [
    'path'
  ],
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
