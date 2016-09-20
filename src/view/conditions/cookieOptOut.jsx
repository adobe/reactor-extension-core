import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import extensionViewReduxForm from '../extensionViewReduxForm';

const CookieOptOut = ({ ...props }) => {
  const { acceptsCookies } = props.fields;
  return (<Checkbox { ...acceptsCookies }>
    User accepts cookies (EU)
  </Checkbox>);
};

const formConfig = {
  fields: [
    'acceptsCookies'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      ...options.settings
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
