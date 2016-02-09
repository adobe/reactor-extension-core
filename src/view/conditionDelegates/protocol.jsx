import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Protocol extends React.Component {
  render() {
    const { protocol } = this.props.fields;

    return (
      <div>
        <Coral.Radio
          {...protocol}
          value="http:"
          checked={protocol.value === 'http:'}>
          HTTP
        </Coral.Radio>
        <Coral.Radio
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
  configToFormValues(values, options) {
    return {
      ...values,
      protocol: options.config.protocol || 'http:'
    };
  }
};

export default extensionViewReduxForm(formConfig)(Protocol);
