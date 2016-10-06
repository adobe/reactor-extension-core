import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field } from 'redux-form';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const TrafficSource = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Traffic Source</span>
      <CoralField
        name="source"
        component={ Textfield }
        supportValidation
      />
    </label>
    <Field
      name="sourceIsRegex"
      component={ RegexToggle }
      valueFieldName="source"
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
