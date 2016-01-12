import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import ErrorIcon from '../components/errorIcon';
import extensionReduxForm from '../extensionReduxForm';

const fields = ['script'];

export class Custom extends React.Component {
  onOpenEditor = () => {
    let scriptField = this.props.fields.script;
    window.extensionBridge.openCodeEditor(scriptField.value, scriptField.onChange);
  };

  render() {
    let script = this.props.fields.script;
    console.log(script.touched, script.error);
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

const validate = values => {
  const errors = {};

  if (!values.script) {
    errors.script = 'Please provide custom script.';
  }

  return errors;
};

export default extensionReduxForm({
  fields,
  validate
})(Custom);
