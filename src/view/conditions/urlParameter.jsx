import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields } from 'redux-form';

import Field from '../components/field';
import RegexToggle from '../components/regexToggle';
import extensionViewReduxForm from '../extensionViewReduxForm';

const URLParameter = () => (
  <div>
    <span className="u-label">URL Parameter Name</span>
    <label className="u-gapRight">
      <Field
        name="name"
        component={ Textfield }
        supportValidation
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">URL Parameter Value</span>
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
      errors.name = 'Please enter a URL parameter name.';
    }

    if (!values.value) {
      errors.value = 'Please enter a URL parameter value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(URLParameter);
