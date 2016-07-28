import React from 'react';
import DisclosureButton from '../../components/disclosureButton';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

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

    let advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div className="u-gapTop">
          <h4 className="coral-Heading coral-Heading--4">Bubbling</h4>

          <Checkbox className="u-block" { ...bubbleFireIfParent }>
              Run this rule even when the event originates from a descendant element
          </Checkbox>
          <Checkbox className="u-block" { ...bubbleFireIfChildFired }>
              Allow this rule to run even if the event already triggered a
              rule targeting a descendant element
          </Checkbox>
          <Checkbox className="u-block" { ...bubbleStop }>
              After the rule runs, prevent the event from triggering rules
              targeting ancestor elements
          </Checkbox>
        </div>
      );
    }

    return (
      <div>
        <div className="AdvancedEventOptions-disclosureButtonContainer">
          <DisclosureButton
            label="Advanced"
            selected={ this.state.expanded }
            onClick={ this.toggleSelected }
          />
        </div>
        { advancedPanel }
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'bubbleFireIfParent',
    'bubbleFireIfChildFired',
    'bubbleStop'
  ],
  settingsToFormValues(values, options) {
    return {
      ...values,
      bubbleFireIfParent: options.settings.bubbleFireIfParent !== false,
      bubbleFireIfChildFired: options.settings.bubbleFireIfChildFired !== false,
      bubbleStop: options.settings.bubbleStop
    };
  }
};
