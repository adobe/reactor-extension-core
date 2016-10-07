import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import { Field } from 'redux-form';

import extensionViewReduxForm from '../extensionViewReduxForm';

const CookieOptOut = () => (
  <Field
    name="acceptsCookies"
    component={ Checkbox }
  >
    User accepts cookies (EU)
  </Field>
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
  }
};

export default extensionViewReduxForm(formConfig)(CookieOptOut);
