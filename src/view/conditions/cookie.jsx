import React from 'react';
import { Fields } from 'redux-form';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import Field from '../components/field';

const Cookie = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Cookie Name</span>
      <Field
        name="name"
        component={ Textfield }
        supportValidation
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">Cookie Value</span>
      <Field
        name="value"
        component={ Textfield }
        supportValidation
      />
    </label>
    <Fields
      names={ ['value', 'valueIsRegex'] }
      component={ RegexToggle }
    />
  </div>
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
