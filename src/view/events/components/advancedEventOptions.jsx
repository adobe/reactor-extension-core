/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
import { Checkbox, Flex, View } from '@adobe/react-spectrum';
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
        <Flex marginTop="size-50" marginStart="size-125" direction="column">
          <WrappedField name="bubbleFireIfParent" component={Checkbox}>
            Run this rule even when the event originates from a descendant
            element
          </WrappedField>

          <WrappedField name="bubbleFireIfChildFired" component={Checkbox}>
            Allow this rule to run even if the event already triggered a rule
            targeting a descendant element
          </WrappedField>

          <WrappedField name="bubbleStop" component={Checkbox}>
            After the rule runs, prevent the event from triggering rules
            targeting ancestor elements
          </WrappedField>
        </Flex>
      );
    }

    return (
      <View>
        <DisclosureButton
          label="Advanced"
          selected={expanded}
          onClick={this.toggleSelected}
        />

        {advancedPanel}
      </View>
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
