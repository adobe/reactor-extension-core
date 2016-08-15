import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';

function Cookie({ ...props }) {
  const name = props.fields.name;

  return (
    <ValidationWrapper error={ name.touched && name.error }>
      <label>
        <span className="u-label">Cookie Name</span>
        <Textfield { ...name } />
      </label>
    </ValidationWrapper>
  );
}

const formConfig = {
  fields: ['name'],
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
