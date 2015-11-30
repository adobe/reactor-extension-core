import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import {stateStream} from '../store';
import actions from '../actions/bubbleActions';

export default React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentWillMount: function() {
    this.unsubscribe = stateStream
      .map(state => {
        return {
          bubbleFireIfParent: state.get('config').get('bubbleFireIfParent'),
          bubbleFireIfChildFired: state.get('config').get('bubbleFireIfChildFired'),
          bubbleStop: state.get('config').get('bubbleStop')
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },

  setBubbleFireIfParent: function(event) {
    actions.setBubbleFireIfParent.push(event.target.checked);
  },

  setBubbleFireIfChildFired: function(event) {
    actions.setBubbleFireIfChildFired.push(event.target.checked);
  },

  setBubbleStop: function(event) {
    actions.setBubbleStop.push(event.target.checked);
  },

  render: function() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleFireIfParent}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleFireIfChildFired}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleStop}
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
