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
import { TextField, Picker, Flex, Item, View } from '@adobe/react-spectrum';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from '../components/wrappedField';
import SelectorLearnMoreLink from '../components/selectorLearnMoreLink';
import NoWrapText from '../components/noWrapText';

const elementPropertyPresets = [
  {
    id: 'id',
    name: 'id'
  },
  {
    id: 'href',
    name: 'href'
  },
  {
    id: 'class',
    name: 'class'
  },
  {
    id: 'src',
    name: 'src'
  },
  {
    id: 'alt',
    name: 'alt'
  },
  {
    id: 'innerHTML',
    name: 'HTML'
  },
  {
    id: 'text',
    name: 'text'
  },
  {
    id: 'name',
    name: 'name'
  },
  {
    id: 'value',
    name: 'value'
  },
  {
    id: 'type',
    name: 'type'
  },
  {
    id: 'custom',
    name: 'other attribute'
  }
];

const DomAttribute = ({ ...props }) => {
  const { selectedElementPropertyPreset } = props;

  return (
    <Flex direction="column" gap="size-100" minWidth="size-4600">
      <Flex gap="size-100" alignItems="end">
        <NoWrapText>From the DOM element matching the CSS Selector</NoWrapText>
        <View flex>
          <WrappedField
            width="100%"
            label="Element Selector"
            name="elementSelector"
            component={TextField}
            isRequired
          />
        </View>
        <View marginBottom="size-20" width="size-1600">
          <SelectorLearnMoreLink />
        </View>
      </Flex>
      <Flex gap="size-100" wrap>
        <WrappedField
          label="Use the value of"
          name="selectedElementPropertyPreset"
          component={Picker}
          items={elementPropertyPresets}
        >
          {(item) => <Item>{item.name}</Item>}
        </WrappedField>

        {selectedElementPropertyPreset === 'custom' ? (
          <WrappedField
            label="Custom Element Property"
            name="customElementProperty"
            component={TextField}
          />
        ) : null}
      </Flex>
    </Flex>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = (state) => ({
  selectedElementPropertyPreset: valueSelector(
    state,
    'selectedElementPropertyPreset'
  )
});

export default connect(stateToProps)(DomAttribute);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const { elementSelector, elementProperty } = settings;

    const elementPropertyIsPreset = elementPropertyPresets.some(
      (preset) => preset.value === elementProperty
    );

    let selectedElementPropertyPreset;
    let customElementProperty;

    if (elementProperty === undefined) {
      selectedElementPropertyPreset = 'id';
    } else if (elementPropertyIsPreset && elementProperty !== 'custom') {
      selectedElementPropertyPreset = elementProperty;
    } else {
      selectedElementPropertyPreset = 'custom';
      customElementProperty = elementProperty;
    }

    return {
      elementSelector,
      selectedElementPropertyPreset,
      customElementProperty
    };
  },

  formValuesToSettings(settings, values) {
    const { selectedElementPropertyPreset, customElementProperty } = values;
    let elementProperty;

    if (selectedElementPropertyPreset === 'custom') {
      elementProperty = customElementProperty;
    } else {
      elementProperty = selectedElementPropertyPreset;
    }

    return {
      elementSelector: values.elementSelector,
      elementProperty
    };
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.elementSelector) {
      errors.elementSelector = 'Please specify a CSS selector.';
    }

    if (
      values.selectedElementPropertyPreset === 'custom' &&
      !values.customElementProperty
    ) {
      errors.customElementProperty = 'Please specify an element property.';
    }

    return errors;
  }
};
