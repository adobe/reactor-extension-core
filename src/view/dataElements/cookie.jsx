import React from 'react';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';

const Cookie = () => (
  <label>
    <span className="u-label">Cookie Name</span>
    <Field
      name="name"
      component={ DecoratedInput }
      inputComponent={ Textfield }
    />
  </label>
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

    // This RegEx is created from:
    // http://stackoverflow.com/questions/1969232/allowed-characters-in-cookies
    if (!/^[a-zA-Z0-9!#$%&'*+-.^_"|~]+$/.test(values.name)) {
      errors.name = 'The cookie name must be a sequence of alphanumeric characters and/or one of ' +
        'the following special characters: ! # $ % & \' * + - . ^ _ | ~';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Cookie);
