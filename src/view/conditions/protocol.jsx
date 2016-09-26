import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';

import extensionViewReduxForm from '../extensionViewReduxForm';
import Field from '../components/field';

const Protocol = () => (
  <div>
    <Field
      name="protocol"
      component={ Radio }
      value="http:"
    >
      HTTP
    </Field>
    <Field
      name="protocol"
      component={ Radio }
      value="https:"
    >
      HTTPS
    </Field>
  </div>
);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      protocol: settings.protocol || 'http:'
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values
    };
  }
};

export default extensionViewReduxForm(formConfig)(Protocol);
