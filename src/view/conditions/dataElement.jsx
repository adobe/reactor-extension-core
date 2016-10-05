import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field } from 'redux-form';

import CoralField from '../components/coralField';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';

const DataElement = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">Data element</span>
      <CoralField
        component={ Textfield }
        name="name"
        supportValidation
        supportDataElementName
      />
    </label>
    <label className="u-gapRight">
      <span className="u-label">has the value</span>
      <CoralField
        component={ Textfield }
        name="value"
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
      errors.name = 'Please specify a data element.';
    }

    if (!values.value) {
      errors.value = 'Please specify a value.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DataElement);
