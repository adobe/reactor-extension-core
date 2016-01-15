import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import ErrorIcon from '../components/errorIcon';
import extensionViewReduxForm from '../extensionViewReduxForm';

export class Custom extends React.Component {
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

const fields = ['script'];

const validate = values => {
  const errors = {};

  if (!values.script) {
    errors.script = 'Please provide custom script.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(Custom);

export const reducers = {
  formValuesToConfig(config, values) {
    return {
      ...config,
      // Important. This is to let the library emitter know that it should convert our
      // script string to an actual function.
      __rawScripts: ['script']
    }
  }
};
