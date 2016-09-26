import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields } from 'redux-form';

import Field from '../components/field';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const TrafficSource = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Traffic Source</span>
      <Field
        name="source"
        component={ Textfield }
        supportValidation
      />
    </label>
    <Fields
      names={ ['source', 'sourceIsRegex'] }
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

    if (!values.source) {
      errors.source = 'Please specify a traffic source.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(TrafficSource);
