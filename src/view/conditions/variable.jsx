import React from 'react';
import Icon from '@coralui/react-coral/lib/Icon';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Tooltip from '@coralui/react-coral/lib/Tooltip';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';


function Variable({ ...props }) {
  const { name, value, valueIsRegex } = props.fields;

  return (
    <div>
      <ValidationWrapper
        type="name"
        className="u-gapRight"
        error={ name.touched && name.error }
      >
        <label>
          <span className="u-label">JS Variable Name</span>
          <Textfield { ...name } />
        </label>
      </ValidationWrapper>
      <ValidationWrapper
        type="value"
        className="u-gapRight"
        error={ value.touched && value.error }
      >
        <label>
          <span className="u-label">JS Variable Value</span>
          <Textfield { ...value } />
        </label>
      </ValidationWrapper>
      <Tooltip
        className="u-tooltipMaxWidth"
        openOn="hover"
        content="Specify a text (string) value here. The rule will only fire if the specified
        variable contains this string. Note: If your variable contains a number, this will not
        work as expected."
      >
        <Icon icon="infoCircle" className="u-inline-tooltip u-gapRight" />
      </Tooltip>
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
      errors.name = 'Please specify a variable name.';
    }

    if (!values.value) {
      errors.value = 'Please specify a variable value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
