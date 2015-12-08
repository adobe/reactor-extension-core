import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import store from '../store';
import actions from '../actions/bubbleActions';

export default React.createClass({
  getInitialState: function() {
    return {
      expanded: false
    };
  },

  componentWillMount: function() {
    this.disposable = store
      .map(state => {
        return {
          bubbleFireIfParent: state.get('bubbleFireIfParent'),
          bubbleFireIfChildFired: state.get('bubbleFireIfChildFired'),
          bubbleStop: state.get('bubbleStop')
        };
      })
      .subscribe(state => this.setState(state));
  },

  componentWillUnmount: function() {
    this.disposable.dispose();
  },

  setExpanded: function(value) {
    this.setState({
      expanded: value
    });
  },

  setBubbleFireIfParent: function(event) {
    actions.bubbleFireIfParent.onNext(event.target.checked);
  },

  setBubbleFireIfChildFired: function(event) {
    actions.bubbleFireIfChildFired.onNext(event.target.checked);
  },

  setBubbleStop: function(event) {
    actions.bubbleStop.onNext(event.target.checked);
  },

  render: function() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleFireIfParent ? true : null}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleFireIfChildFired ? true : null}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.state.bubbleStop ? true : null}
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
