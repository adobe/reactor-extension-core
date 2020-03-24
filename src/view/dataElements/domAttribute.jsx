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
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import Link from '@react/react-spectrum/Link';
import Textfield from '@react/react-spectrum/Textfield';
import Select from '@react/react-spectrum/Select';
import WrappedField from '../components/wrappedField';

const elementPropertyPresets = [
  {
    value: 'id',
    label: 'id'
  },
  {
    value: 'href',
    label: 'href'
  },
  {
    value: 'class',
    label: 'class'
  },
  {
    value: 'src',
    label: 'src'
  },
  {
    value: 'alt',
    label: 'alt'
  },
  {
    value: 'innerHTML',
    label: 'HTML'
  },
  {
    value: 'text',
    label: 'text'
  },
  {
    value: 'name',
    label: 'name'
  },
  {
    value: 'value',
    label: 'value'
  },
  {
    value: 'type',
    label: 'type'
  },
  {
    value: 'custom',
    label: 'other attribute'
  }
];

const DomAttribute = ({ ...props }) => {
  const { selectedElementPropertyPreset } = props;

  return (
    <div>
      <div className="u-gapBottom">
        <label className="u-flex">
          <span className="u-flexCenter u-gapRight">
            From the DOM element matching the CSS Selector
          </span>
          <WrappedField
            className="u-flexOne"
            name="elementSelector"
            component={Textfield}
            componentClassName="u-fullWidth u-minFieldWidth"
          />
          <Link
            className="u-flexCenter u-gapLeft u-gapLinkRight"
            href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </Link>
        </label>
      </div>
      <div>
        <label className="u-gapRight">
          <span className="u-verticalAlignMiddle u-gapRight">Use the value of</span>
          <WrappedField
            name="selectedElementPropertyPreset"
            component={Select}
            options={elementPropertyPresets}
          />
        </label>
        {
          (selectedElementPropertyPreset === 'custom') ?
            (
              <WrappedField
                name="customElementProperty"
                component={Textfield}
              />
            ) :
            null
        }
      </div>
    </div>
  );
};

const valueSelector = formValueSelector('default');
const stateToProps = state => ({
  selectedElementPropertyPreset: valueSelector(state, 'selectedElementPropertyPreset')
});

export default connect(stateToProps)(DomAttribute);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const { elementSelector, elementProperty } = settings;

    const elementPropertyIsPreset =
      elementPropertyPresets.some(preset => preset.value === elementProperty);

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

    if (values.selectedElementPropertyPreset === 'custom' && !values.customElementProperty) {
      errors.customElementProperty = 'Please specify an element property.';
    }

    return errors;
  }
};
