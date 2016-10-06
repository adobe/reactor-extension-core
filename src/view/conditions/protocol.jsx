import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';

import extensionViewReduxForm from '../extensionViewReduxForm';
import CoralField from '../components/coralField';

const Protocol = () => (
  <div>
    <CoralField
      name="protocol"
      component={ Radio }
      value="http:"
    >
      HTTP
    </CoralField>
    <CoralField
      name="protocol"
      component={ Radio }
      value="https:"
    >
      HTTPS
    </CoralField>
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
