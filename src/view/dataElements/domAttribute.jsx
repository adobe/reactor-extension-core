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
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import InfoTip from '@reactor/react-components/lib/infoTip';
import Link from '@coralui/react-coral/lib/Link';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';

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
        <label>
          <span className="u-label">From the DOM element matching the CSS Selector</span>
          <Field
            name="elementSelector"
            component={ DecoratedInput }
            inputComponent={ Textfield }
          />
          <InfoTip placement="bottom">
            CSS selectors allow you to target specific elements in a webpage.
            <br />
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors"
              rel="noopener noreferrer"
              target="_blank"
              subtle
            >
              Learn more about CSS selectors.
            </Link>
          </InfoTip>
        </label>
      </div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">Use the value of</span>
          <Field
            name="selectedElementPropertyPreset"
            component={ Select }
            options={ elementPropertyPresets }
            backspaceRemoves={ false }
          />
        </label>
        {
          (selectedElementPropertyPreset === 'custom') ?
            <Field
              name="customElementProperty"
              component={ DecoratedInput }
              inputComponent={ Textfield }
            />
            : null
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
