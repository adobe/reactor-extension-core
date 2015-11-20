import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import store from '../store';

export default React.createClass({
  getInitialState: function() {
    return {
      config: store.getConfig(),
      expanded: false
    };
  },

  componentWillMount: function() {
    store.register(this.onStoreUpdate);

    if (!this.state.config.hasOwnProperty('bubbleFireIfParent')) {
      this.state.config.bubbleFireIfParent = true;
    }

    if (!this.state.config.hasOwnProperty('bubbleFireIfChildFired')) {
      this.state.config.bubbleFireIfChildFired = true;
    }
  },

  componentWillUnmount: function() {
    store.unregister(this.onStoreUpdate);
  },

  onStoreUpdate: function(config) {
    this.setState({
      config: config
    });
  },

  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },

  setBubbleFireIfParent: function(event) {
    this.state.config.bubbleFireIfParent = event.target.checked || null;
  },

  setBubbleFireIfChildFired: function(event) {
    this.state.config.bubbleFireIfChildFired = event.target.checked || null;
  },

  setBubbleStop: function(event) {
    this.state.config.bubbleStop = event.target.checked || null;
  },

  render: function() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.config.bubbleFireIfParent}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.config.bubbleFireIfChildFired}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.config.bubbleStop}
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
