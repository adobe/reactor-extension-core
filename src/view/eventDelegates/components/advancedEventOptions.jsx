import React from 'react';
import Coral from '../../reduxFormCoralUI';
import DisclosureButton from '../../components/disclosureButton';

export let fields = [
  'bubbleFireIfParent',
  'bubbleFireIfChildFired',
  'bubbleStop'
];

export default class AdvancedEventOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  toggleSelected = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };
  render() {
    const { bubbleFireIfParent, bubbleFireIfChildFired, bubbleStop } = this.props.fields;

    var advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div>
          <h4 className="coral-Heading coral-Heading--4">Bubbling</h4>

          <Coral.Checkbox
            ref="bubbleFireIfParentCheckbox"
            className="u-block"
            {...bubbleFireIfParent}>
              Run this rule even when the event originates from a descendant element
          </Coral.Checkbox>
          <Coral.Checkbox
            ref="bubbleFireIfChildFiredCheckbox"
            className="u-block"
            {...bubbleFireIfChildFired}>
              Allow this rule to run even if the event already triggered a
              rule targeting a descendant element
          </Coral.Checkbox>
          <Coral.Checkbox
            ref="bubbleStopCheckbox"
            className="u-block"
            {...bubbleStop}>
              After the rule runs, prevent the event from triggering rules
              targeting ancestor elements
          </Coral.Checkbox>
        </div>
      );
    }

    return (
      <div>
        <div className="AdvancedEventOptions-disclosureButtonContainer">
          <DisclosureButton
            ref="disclosureButton"
            label="Advanced"
            selected={this.state.expanded}
            onClick={this.toggleSelected}/>
        </div>
        {advancedPanel}
      </div>
    );
  }
}
