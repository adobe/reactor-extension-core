import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import {config} from '../store/config';

export default React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },
  componentWillMount: function() {
    if (!config.hasOwnProperty('bubbleFireIfParent')) {
      config.bubbleFireIfParent = true;
    }

    if (!config.hasOwnProperty('bubbleFireIfChildFired')) {
      config.bubbleFireIfChildFired = true;
    }
  },
  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },
  setBubbleFireIfParent: function(event) {
    config.bubbleFireIfParent = event.target.checked;
    this.forceUpdate();
  },
  setBubbleFireIfChildFired: function(event) {
    config.bubbleFireIfChildFired = event.target.checked;
    this.forceUpdate();
  },
  setBubbleStop: function(event) {
    config.bubbleStop = event.target.checked;
    this.forceUpdate();
  },
  render: function() {
    var bubbleFireIfParentChecked = config.bubbleFireIfParent || null;
    var bubbleFireIfChildFiredChecked = config.bubbleFireIfChildFired || null;
    var bubbleStopChecked = config.bubbleStop || null;
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={bubbleFireIfParentChecked}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={bubbleFireIfChildFiredChecked}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={bubbleStopChecked}
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
