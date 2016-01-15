import React from 'react';
import Coral from 'coralui-support-react';

export default class RegexToggle extends React.Component {
  onToggleChange = event => {
    this.props.onValueIsRegexChange(event.target.checked);
  };

  onTestRegex = () => {
    window.extensionBridge.openRegexTester(
      this.props.value,
      this.props.onValueChange || function() {}
    );
  };

  render() {
    return (
      <div className="u-inlineBlock">
        <label>
          <Coral.Switch
            className="u-gapRight"
            checked={this.props.valueIsRegex}
            onChange={this.onToggleChange}/>
          <span className="u-label">Regex</span>
          <button
            className="u-buttonReset coral-Link"
            onClick={this.onTestRegex}
            style={{ visibility: this.props.valueIsRegex ? 'visible' : 'hidden' }}>Test</button>
        </label>
      </div>
    );
  }
}
