import React from 'react';
import Coral from 'coralui-support-react';
import getPatternIfRegex from '../utils/getPatternIfRegex';

export default React.createClass({
  onToggleChange: function(event) {
    this.props.setIsRegex(event.target.checked);
  },

  onTestRegex: function() {
    // TODO: This is just for testing. Update once a regex tester is in place.
    var patternString = getPatternIfRegex(this.props.value);
    patternString += ' (edited)';
    this.props.setValue(new RegExp(patternString, 'i'));
  },

  render: function() {
    var isValueRegex = this.props.value instanceof RegExp;
    var testRegexButton;

    if (isValueRegex) {
      testRegexButton = <button className="u-buttonReset coral-Link" onClick={this.onTestRegex}>Test Regex</button>;
    }

    return (
      <div className="u-inlineBlock">
        <label>
          <Coral.Switch
            class="u-gapRight"
            checked={isValueRegex ? true : null}
            coral-onChange={this.onToggleChange}/>
          <span className="u-gapRight">Regex</span>
          {testRegexButton}
        </label>
      </div>
    );
  }
});
