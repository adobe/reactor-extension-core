import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from './regexToggle';
import getPatternIfRegex from '../utils/getPatternIfRegex';

export default React.createClass({
  remove: function() {
    this.props.remove();
  },

  onNameBlur: function(event) {
    this.props.setName(event.target.value);
  },

  onValueBlur: function(event) {
    var value = event.target.value;

    // If the curernt value is regex, make the new value regex.
    if (this.props.value instanceof RegExp) {
      value = new RegExp(value, 'i');
    }

    this.props.setValue(value);
  },

  setIsRegex: function(isRegex) {
    var value = getPatternIfRegex(this.props.value);

    if (isRegex) {
      value = new RegExp(value, 'i');
    }

    this.props.setValue(value);
  },

  render: function() {
    var displayValue = getPatternIfRegex(this.props.value);

    var removeButton;

    if (this.props.removable) {
      removeButton = (
        <Coral.Button
          variant="quiet"
          icon="close"
          iconsize="XS"
          onClick={this.remove}/>
      );
    }

    return (
      <div className="u-gapBottom">
        <Coral.Textfield 
          ref="nameField"
          class="u-gapRight"
          placeholder="Property" 
          defaultValue={this.props.name}
          onBlur={this.onNameBlur}/>
        <span className="u-gapRight">=</span>
        <Coral.Textfield 
          ref="valueField"
          class="u-gapRight"
          placeholder="Value" 
          defaultValue={displayValue}
          onBlur={this.onValueBlur}/>
        <RegexToggle
          setValue={this.props.setValue}
          value={this.props.value}
          setIsRegex={this.setIsRegex}/>
        {removeButton}
      </div>
    )
  }
});
