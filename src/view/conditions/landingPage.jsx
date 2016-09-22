import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const LandingPage = ({ ...props }) => {
  const { page, pageIsRegex } = props.fields;

  return (
    <div>
      <ValidationWrapper
        className="u-gapRight"
        error={ page.touched && page.error }
      >
        <label>
          <span className="u-label">Landing Page</span>
          <Textfield { ...page } />
        </label>
      </ValidationWrapper>
      <RegexToggle
        value={ page.value }
        valueIsRegex={ pageIsRegex.value }
        onValueChange={ page.onChange }
        onValueIsRegexChange={ pageIsRegex.onChange }
      />
    </div>
  );
};

const formConfig = {
  fields: [
    'page',
    'pageIsRegex'
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

    if (!values.page) {
      errors.page = 'Please specify a landing page.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(LandingPage);
