import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import extensionViewReduxForm from '../extensionViewReduxForm';

function QueryParameter({ ...props }) {
  const { name, caseInsensitive } = props.fields;

  return (
    <div>
      <ValidationWrapper
        error={ name.touched && name.error }
        className="u-gapRight"
      >
        <label>
          <span className="u-label">URL Querystring Parameter Name</span>
          <Textfield { ...name } />
        </label>
      </ValidationWrapper>
      <Checkbox { ...caseInsensitive }>
        Ignore capitalization differences
      </Checkbox>
    </div>
  );
}

const formConfig = {
  fields: [
    'name',
    'caseInsensitive'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      caseInsensitive: options.settingsIsNew || options.settings.caseInsensitive
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a query string parameter name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(QueryParameter);
