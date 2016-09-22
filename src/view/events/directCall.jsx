import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';

import Textfield from '@coralui/react-coral/lib/Textfield';
import extensionViewReduxForm from '../extensionViewReduxForm';

function DirectCall({ ...props }) {
  const { name } = props.fields;

  return (
    <ValidationWrapper error={ name.touched && name.error }>
      <label>
        <span className="u-label">_satellite.track string</span>
        <Textfield { ...name } />
      </label>
    </ValidationWrapper>
  );
}

const formConfig = {
  fields: ['name'],
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
