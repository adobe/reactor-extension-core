import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import RegexToggle from '../components/regexToggle';
import extensionViewReduxForm from '../extensionViewReduxForm';

function URLParameter({ ...props }) {
  const { name, value, valueIsRegex } = props.fields;

  return (
    <div>
      <ValidationWrapper
        type="name"
        className="u-gapRight"
        error={ name.touched && name.error }
      >
        <span className="u-label">URL Parameter Name</span>
        <Textfield { ...name } />
      </ValidationWrapper>
      <ValidationWrapper
        type="value"
        className="u-gapRight"
        error={ value.touched && value.error }
      >
        <span className="u-label">URL Parameter Value</span>
        <Textfield { ...value } />
      </ValidationWrapper>
      <RegexToggle
        value={ value.value }
        valueIsRegex={ valueIsRegex.value }
        onValueChange={ value.onChange }
        onValueIsRegexChange={ valueIsRegex.onChange }
      />
    </div>
  );
}

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
      errors.name = 'Please enter a URL parameter name.';
    }

    if (!values.value) {
      errors.value = 'Please enter a URL parameter value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(URLParameter);
