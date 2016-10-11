import React from 'react';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';

const DataElementChanged = () => (
  <label>
    <span className="u-label">Data Element Name</span>
    <Field
      name="name"
      component={ DecoratedInput }
      inputComponent={ Textfield }
      supportDataElementName
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
    if (!values.name) {
      errors = {
        ...errors,
        name: 'Please specify a data element name.'
      };
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DataElementChanged);
