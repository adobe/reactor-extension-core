import React from 'react';
import Coral from 'coralui-support-react';
import DisclosureButton from './disclosureButton';
import { actionCreators } from '../actions/common/bubbleActions';
import { connect } from 'react-redux';

export let mapStateToProps = state => ({
  bubbleFireIfParent: state.get('bubbleFireIfParent'),
  bubbleFireIfChildFired: state.get('bubbleFireIfChildFired'),
  bubbleStop: state.get('bubbleStop')
});

export class AdvancedEventOptions extends React.Component {
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
    this.props.dispatch(actionCreators.setBubbleFireIfParent(event.target.checked));
  };

  setBubbleFireIfChildFired = event => {
    this.props.dispatch(actionCreators.setBubbleFireIfChildFired(event.target.checked));
  };

  setBubbleStop = event => {
    this.props.dispatch(actionCreators.setBubbleStop(event.target.checked));
  };

  render() {
    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <h4 className="coral-Heading coral-Heading--4">Bubbling</h4>

          <Coral.Checkbox
            className="u-block"
            checked={this.props.bubbleFireIfParent}
            onChange={this.setBubbleFireIfParent}>Run this rule even when the event originates from a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            className="u-block"
            checked={this.props.bubbleFireIfChildFired}
            onChange={this.setBubbleFireIfChildFired}>Allow this rule to run even if the event already triggered a rule targeting a descendant element</Coral.Checkbox>
          <Coral.Checkbox
            className="u-block"
            checked={this.props.bubbleStop}
            onChange={this.setBubbleStop}>After the rule runs, prevent the event from triggering rules targeting ancestor elements</Coral.Checkbox>
        </div>
      );
    }

    return (
      <div ref="niner">
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

export default connect(mapStateToProps)(AdvancedEventOptions);
