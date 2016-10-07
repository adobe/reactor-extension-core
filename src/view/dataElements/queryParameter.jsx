import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import extensionViewReduxForm from '../extensionViewReduxForm';

const QueryParameter = () => (
  <div>
    <label className="u-gapRight">
      <span className="u-label">URL Querystring Parameter Name</span>
      <Field
        name="name"
        component={ DecoratedInput }
        inputComponent={ Textfield }
      />
    </label>
    <Field
      name="caseInsensitive"
      component={ Checkbox }
    >
      Ignore capitalization differences
    </Field>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings, state) {
    return {
      ...values,
      ...settings,
      caseInsensitive: state.meta.isNew || settings.caseInsensitive
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
      errors.name = 'Please specify a query string parameter name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(QueryParameter);
