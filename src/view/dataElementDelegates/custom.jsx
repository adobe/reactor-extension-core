import React from 'react';
import Coral from '../reduxFormCoralUI';
import ErrorIcon from '../components/errorIcon';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Custom extends React.Component {
  onOpenEditor = () => {
    let scriptField = this.props.fields.script;
    window.extensionBridge.openCodeEditor(scriptField.value, scriptField.onChange);
  };

  render() {
    let script = this.props.fields.script;

    return (
      <div>
        <Coral.Button icon="code" onClick={this.onOpenEditor}>Open Editor</Coral.Button>
        {script.touched && script.error ?
          <ErrorIcon message={script.error}/> : null
        }
      </div>
    );
  }
}

const formConfig = {
  fields: ['script'],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.script) {
      errors.script = 'Please provide custom script.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Custom);
