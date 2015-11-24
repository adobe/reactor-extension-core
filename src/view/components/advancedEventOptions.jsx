import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';

export default React.createClass({
  mixins: [ConfigComponentMixin],

  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentWillMount: function() {
    if (!this.config.hasOwnProperty('bubbleFireIfParent')) {
      this.config.bubbleFireIfParent = true;
    }

    if (!this.config.hasOwnProperty('bubbleFireIfChildFired')) {
      this.config.bubbleFireIfChildFired = true;
    }
  },

  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },

  setBubbleFireIfParent: function(event) {
    this.config.bubbleFireIfParent = event.target.checked || null;
  },

  setBubbleFireIfChildFired: function(event) {
    this.config.bubbleFireIfChildFired = event.target.checked || null;
  },

  setBubbleStop: function(event) {
    this.config.bubbleStop = event.target.checked || null;
  },

  render: function() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={this.config.bubbleFireIfParent}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.config.bubbleFireIfChildFired}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.config.bubbleStop}
            coral-onChange={this.setBubbleStop}>After the rule runs, prevent the event from triggering rules targeting ancestor elements</Coral.Checkbox>
        </div>
      );
    }

    return (
      <div>
        <div className="AdvancedEventOptions-disclosureButtonContainer">
          <DisclosureButton
            label="Advanced"
            selected={this.state.expanded}
            setSelected={this.setExpanded}/>
        </div>
        {advancedPanel}
      </div>
    );
  }
});
