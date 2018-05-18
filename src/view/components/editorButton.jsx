import React from 'react';
import Button from '@react/react-spectrum/Button';
import Code from '@react/react-spectrum/Icon/Code';

class EditorButton extends React.Component {
  onClick = () => {
    const {
      onChange,
      value,
      language
    } = this.props;

    const options = {
      code: value
    };

    if (language) {
      options.language = language;
    }

    window.extensionBridge.openCodeEditor(options).then(onChange);
  };

  render() {
    const {
      className,
      invalid
    } = this.props;

    return (
      <Button
        icon={ <Code /> }
        className={ className }
        onClick={ this.onClick }
        variant={ invalid ? 'warning' : 'primary' }
      >
        Open Editor
      </Button>
    );
  }
}

export default EditorButton;
