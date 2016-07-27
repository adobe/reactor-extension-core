import React from 'react';
import classNames from 'classnames';
import Switch from '@coralui/react-coral/lib/Switch';

export default class RegexToggle extends React.Component {
  onToggleChange = event => {
    this.props.onValueIsRegexChange(event.target.checked);
  };

  onTestRegex = () => {
    window.extensionBridge.openRegexTester(
      this.props.value,
      this.props.onValueChange || (() => {})
    );
  };

  render() {
    return (
      <div className={ classNames(this.props.className, 'u-inlineBlock') }>
        <label>
          <Switch
            className="u-gapRight"
            checked={ this.props.valueIsRegex }
            onChange={ this.onToggleChange }
          />
          <span className="u-label">Regex</span>
          <button
            className="u-buttonReset coral-Link"
            onClick={ this.onTestRegex }
            style={ { visibility: this.props.valueIsRegex ? 'visible' : 'hidden' } }
          >Test</button>
        </label>
      </div>
    );
  }
}
