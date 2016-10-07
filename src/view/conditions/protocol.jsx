import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import { Field } from 'redux-form';

import extensionViewReduxForm from '../extensionViewReduxForm';

const Protocol = () => (
  <div>
    <Field
      name="protocol"
      component={ Radio }
      type="radio"
      value="http:"
    >
      HTTP
    </Field>
    <Field
      name="protocol"
      component={ Radio }
      type="radio"
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
