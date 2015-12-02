import React from 'react';
import Coral from 'coralui-support-react';
import RegexToggle from './regexToggle';

export default React.createClass({
  remove: function() {
    this.props.remove();
  },

  onNameChange: function(event) {
    this.props.setName(event.target.value);
  },

  onValueChange: function(event) {
    this.props.setValue(event.target.value);
  },

  setValueIsRegex: function(isRegex) {
    this.props.setValueIsRegex(isRegex);
  },

  render: function() {
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
          value={this.props.name}
          onChange={this.onNameChange}/>
        <span className="u-gapRight">=</span>
        <Coral.Textfield 
          ref="valueField"
          class="u-gapRight"
          placeholder="Value" 
          value={this.props.value}
          onChange={this.onValueChange}/>
        <RegexToggle
          value={this.props.value}
          valueIsRegex={this.props.valueIsRegex}
          setValue={this.props.setValue}
          setValueIsRegex={this.setValueIsRegex}/>
        {removeButton}
      </div>
    )
  }
});
