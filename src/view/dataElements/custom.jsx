import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';

class Custom extends React.Component {
  onOpenEditor = () => {
    const sourceField = this.props.fields.source;
    window.extensionBridge.openCodeEditor(sourceField.value, sourceField.onChange);
  };

  render() {
    const source = this.props.fields.source;

    return (
      <div>
        <Button icon="code" onClick={ this.onOpenEditor }>
          Open Editor
        </Button>
        { source.touched && source.error ?
          <ErrorTip>{ source.error }</ErrorTip> : null
        }
      </div>
    );
  }
}

const formConfig = {
  fields: ['source'],
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
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.source) {
      errors.source = 'Please provide custom script.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Custom);
