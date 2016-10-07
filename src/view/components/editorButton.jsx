import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import ErrorTip from '@reactor/react-components/lib/errorTip';

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
        <Button
          icon="code"
          className={ className }
          onClick={ this.onClick }
        >
          Open Editor
        </Button>

        {
          touched && error ? <ErrorTip>{ error }</ErrorTip> : null
        }
      </span>
    );
  }
}

export default EditorButton;
