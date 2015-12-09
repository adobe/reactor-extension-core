import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import {
  setBubbleFireIfParent,
  setBubbleFireIfChildFired,
  setBubbleStop
} from '../actions/bubbleActions';
import { connect } from 'react-redux';

@connect(state => ({
  bubbleFireIfParent: state.get('bubbleFireIfParent'),
  bubbleFireIfChildFired: state.get('bubbleFireIfChildFired'),
  bubbleStop: state.get('bubbleStop')
}))
export default class AdvancedEventOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    }
  }

  setExpanded = value => {
    this.setState({
      expanded: value
    });
  };

  setBubbleFireIfParent = event => {
    this.props.dispatch(setBubbleFireIfParent(event.target.checked));
  };

  setBubbleFireIfChildFired = event => {
    this.props.dispatch(setBubbleFireIfChildFired(event.target.checked));
  };

  setBubbleStop = event => {
    this.props.dispatch(setBubbleStop(event.target.checked));
  };

  render() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <Coral.Checkbox
            class="u-block"
            checked={this.props.bubbleFireIfParent}
            coral-onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.props.bubbleFireIfChildFired}
            coral-onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            class="u-block"
            checked={this.props.bubbleStop}
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
}
