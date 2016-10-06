import React from 'react';
import { Field } from 'redux-form';
import { Button } from '@coralui/react-coral';
import { ErrorTip } from '@reactor/react-components';

class EditorButton extends React.Component {
  onClick = () => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    window.extensionBridge.openCodeEditor(value, onChange);
  };

  render() {
    const {
      className,
      meta: {
        touched,
        error
      }
    } = this.props;

    return (
      <span>
        <Button className={ className } icon="code" onClick={ this.onClick }>Open Editor</Button>
        { touched && error ?
          <ErrorTip>{ error }</ErrorTip> : null
        }
      </span>
    );
  }
}

const CodeField = props => (
  <Field component={ EditorButton } { ...props } />
);

export default CodeField;
