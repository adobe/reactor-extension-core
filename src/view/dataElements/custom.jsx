import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ErrorTip } from '@reactor/react-components';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Custom extends React.Component {
  onOpenEditor = () => {
    let sourceField = this.props.fields.source;
    window.extensionBridge.openCodeEditor(sourceField.value, sourceField.onChange);
  };

  render() {
    let source = this.props.fields.source;

    return (
      <div>
        <Coral.Button ref="openEditorButton" icon="code" onClick={this.onOpenEditor}>
          Open Editor
        </Coral.Button>
        {source.touched && source.error ?
          <ErrorTip ref="sourceErrorIcon" message={source.error}/> : null
        }
      </div>
    );
  }
}

const formConfig = {
  fields: ['source'],
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
