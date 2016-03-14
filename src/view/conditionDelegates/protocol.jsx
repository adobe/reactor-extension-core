import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Protocol extends React.Component {
  render() {
    const { protocol } = this.props.fields;

    return (
      <div>
        <Coral.Radio
          ref="httpRadio"
          {...protocol}
          value="http:"
          checked={protocol.value === 'http:'}>
          HTTP
        </Coral.Radio>
        <Coral.Radio
          ref="httpsRadio"
          {...protocol}
          value="https:"
          checked={protocol.value === 'https:'}>
          HTTPS
        </Coral.Radio>
      </div>
    );
  }
}

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
