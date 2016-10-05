import React from 'react';
import { Field } from 'redux-form';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import CoralField from '../components/coralField';

const Cookie = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Cookie Name</span>
      <CoralField
        name="name"
        component={ Textfield }
        supportValidation
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">Cookie Value</span>
      <CoralField
        name="value"
        component={ Textfield }
        supportValidation
      />
    </label>

    <Field
      name="valueIsRegex"
      component={ RegexToggle }
      valueFieldName="value"
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
