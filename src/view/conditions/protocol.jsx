import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import extensionViewReduxForm from '../extensionViewReduxForm';

const Protocol = ({ ...props }) => {
  const { protocol } = props.fields;

  return (
    <div>
      <Radio
        { ...protocol }
        value="http:"
        checked={ protocol.value === 'http:' }
      >
        HTTP
      </Radio>
      <Radio
        { ...protocol }
        value="https:"
        checked={ protocol.value === 'https:' }
      >
        HTTPS
      </Radio>
    </div>
  );
};

const formConfig = {
  fields: ['protocol'],
  settingsToFormValues(values, options) {
    return {
      ...values,
      protocol: options.settings.protocol || 'http:'
    };
  }
};

export default extensionViewReduxForm(formConfig)(Protocol);
