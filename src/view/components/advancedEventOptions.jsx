import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import {stateStream} from '../store';
import {setConfigParts, deleteConfigParts} from '../actions';

export default React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentWillMount: function() {
    this.unsub = stateStream
      .filterByChanges([
        'bubbleFireIfParent',
        'bubbleFireIfChildFired',
        'bubbleStop'
      ])
      .map((state) => {
        return {
          bubbleFireIfParent: state.bubbleFireIfParent,
          bubbleFireIfChildFired: state.bubbleFireIfChildFired,
          bubbleStop: state.bubbleStop
        };
      })
      .assign(this, 'setState');
  },

  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },

  setBubbleFireIfParent: function(event) {
    if (event.target.checked) {
      setConfigParts.push({
        bubbleFireIfParent: true
      })
    } else {
      deleteConfigParts.push([
        'bubbleFireIfParent'
      ]);
    }
  },

  setBubbleFireIfChildFired: function(event) {
    if (event.target.checked) {
      setConfigParts.push({
        bubbleFireIfChildFired: true
      })
    } else {
      deleteConfigParts.push([
        'bubbleFireIfChildFired'
      ]);
    }
  },

  setBubbleStop: function(event) {
    if (event.target.checked) {
      setConfigParts.push({
        bubbleStop: true
      })
    } else {
      deleteConfigParts.push([
        'bubbleStop'
      ]);
    }
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
