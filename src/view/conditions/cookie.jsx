import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const Cookie = ({ ...props }) => {
  const { name, value, valueIsRegex } = props.fields;

  return (
    <div>
      <ValidationWrapper
        type="name"
        className="u-gapRight"
        error={ name.touched && name.error }
      >
        <label>
          <span className="u-label">Cookie Name</span>
          <Textfield { ...name } />
        </label>
      </ValidationWrapper>
      <ValidationWrapper
        className="u-gapRight"
        type="value"
        error={ value.touched && value.error }
      >
        <label>
          <span className="u-label">Cookie Value</span>
          <Textfield { ...value } />
        </label>
      </ValidationWrapper>
      <RegexToggle
        value={ value.value }
        valueIsRegex={ valueIsRegex.value }
        onValueChange={ value.onChange }
        onValueIsRegexChange={ valueIsRegex.onChange }
      />
    </div>
  );
};

const formConfig = {
  fields: [
    'name',
    'value',
    'valueIsRegex'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a cookie name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a cookie value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Cookie);
