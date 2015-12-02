import React from 'react';
import Coral from 'coralui-support-react';
export default React.createClass({
  onToggleChange: function(event) {
    this.props.setValueIsRegex(event.target.checked);
  },

  onTestRegex: function() {
    // TODO: This updated value is just for testing. Update once a regex tester is in place.
    this.props.setValue(this.props.value + ' (edited)');
  },

  render: function() {
    return (
      <div className="u-inlineBlock">
        <label>
          <Coral.Switch
            class="u-gapRight"
            checked={this.props.valueIsRegex ? true : null}
            coral-onChange={this.onToggleChange}/>
          <span className="u-gapRight">Regex</span>
          <button
            className="u-buttonReset coral-Link"
            onClick={this.onTestRegex}
            style={{ visibility: this.props.valueIsRegex ? 'visible' : 'hidden' }}>Test</button>
        </label>
      </div>
    );
  }
});
