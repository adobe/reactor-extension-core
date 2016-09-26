import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import extensionViewReduxForm from '../extensionViewReduxForm';
import Field from '../components/field';

const CookieOptOut = () => (
  <Field component={ Checkbox } name="acceptsCookies">
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
