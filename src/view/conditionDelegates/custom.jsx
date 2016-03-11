import React from 'react';
import Coral from 'coralui-support-reduxform';
import { ErrorTip } from '@reactor/react-components';

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
        <Coral.Button ref="openEditorButton" icon="code" onClick={this.onOpenEditor}>
          Open Editor
        </Coral.Button>
        {script.touched && script.error ?
          <ErrorTip ref="scriptErrorIcon" message={script.error}/> : null
        }
        <Coral.Icon icon="infoCircle" className="Custom-tooltip u-gapLeft"/>
        <Coral.Tooltip className="u-tooltipMaxWidth" placement="right" target="_prev">
          Enter a script that must evaluate true/false to control whether this rule executes.
          Use this field to check for certain values like shopping cart size or item price,
          whether a user is logged in or registered, or anything else you can dream up.
        </Coral.Tooltip>
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
