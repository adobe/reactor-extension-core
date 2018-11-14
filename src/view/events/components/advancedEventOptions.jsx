/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React from 'react';
import Checkbox from '@react/react-spectrum/Checkbox';
import WrappedField from '../../components/wrappedField';
import DisclosureButton from '../../components/disclosureButton';

export default class AdvancedEventOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  toggleSelected = () => {
    const { expanded } = this.state;

    this.setState({
      expanded: !expanded
    });
  };

  render() {
    let advancedPanel;

    const { expanded } = this.state;

    if (expanded) {
      advancedPanel = (
        <div className="u-gapTop">
          <WrappedField
            name="bubbleFireIfParent"
            className="u-block"
            component={Checkbox}
            label="Run this rule even when the event originates from a descendant element"
          />

          <WrappedField
            name="bubbleFireIfChildFired"
            className="u-block"
            component={Checkbox}
            label="Allow this rule to run even if the event already triggered a rule targeting
              a descendant element"
          />

          <WrappedField
            name="bubbleStop"
            className="u-block"
            component={Checkbox}
            label="After the rule runs, prevent the event from triggering rules targeting
              ancestor elements"
          />
        </div>
      );
    }

    return (
      <div>
        <div className="AdvancedEventOptions-disclosureButtonContainer">
          <DisclosureButton
            label="Advanced"
            selected={expanded}
            onClick={this.toggleSelected}
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
