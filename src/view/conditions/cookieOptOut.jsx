import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import extensionViewReduxForm from '../extensionViewReduxForm';
import CoralField from '../components/coralField';

const CookieOptOut = () => (
  <CoralField component={ Checkbox } name="acceptsCookies">
    User accepts cookies (EU)
  </CoralField>
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
