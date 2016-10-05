import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields } from 'redux-form';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import CoralField from '../components/coralField';

const LandingPage = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Landing Page</span>
      <CoralField
        name="page"
        component={ Textfield }
        supportValidation
      />
    </label>
    <Fields
      names={ ['page', 'pageIsRegex'] }
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

    if (!values.page) {
      errors.page = 'Please specify a landing page.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(LandingPage);
