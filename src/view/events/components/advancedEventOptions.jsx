import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import Field from '../../components/field';
import DisclosureButton from '../../components/disclosureButton';

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
    let advancedPanel;

    if (this.state.expanded) {
      advancedPanel = (
        <div className="u-gapTop">
          <h4 className="coral-Heading coral-Heading--4">Bubbling</h4>

          <Field
            name="bubbleFireIfParent"
            className="u-block"
            component={ Checkbox }
          >
            Run this rule even when the event originates from a descendant element
          </Field>

          <Field
            name="bubbleFireIfChildFired"
            className="u-block"
            component={ Checkbox }
          >
            Allow this rule to run even if the event already triggered a
            rule targeting a descendant element
          </Field>

          <Field
            name="bubbleStop"
            className="u-block"
            component={ Checkbox }
          >
            After the rule runs, prevent the event from triggering rules
            targeting ancestor elements
          </Field>
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
  settingsToFormValues(values, settings) {
    return {
      ...values,
      bubbleFireIfParent: settings.bubbleFireIfParent !== false,
      bubbleFireIfChildFired: settings.bubbleFireIfChildFired !== false,
      bubbleStop: settings.bubbleStop
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      bubbleFireIfParent: values.bubbleFireIfParent,
      bubbleFireIfChildFired: values.bubbleFireIfChildFired,
      bubbleStop: values.bubbleStop
    };
  }
};
