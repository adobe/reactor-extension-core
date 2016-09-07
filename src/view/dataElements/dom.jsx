import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';

import extensionViewReduxForm from '../extensionViewReduxForm';

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

function DOM({ ...props }) {
  const {
    fields: {
      elementSelector,
      selectedElementPropertyPreset,
      customElementProperty
    }
  } = props;

  return (
    <div>
      <div className="u-gapBottom">
        <ValidationWrapper
          type="elementSelector"
          error={ elementSelector.touched && elementSelector.error }
        >
          <label>
            <span className="u-label">From the DOM element matching the CSS Selector</span>
            <Textfield { ...elementSelector } />
          </label>
        </ValidationWrapper>
      </div>
      <div>
        <label>
          <span className="u-label">Use the value of</span>
          <Select
            { ...selectedElementPropertyPreset }
            className="u-gapRight"
            options={ elementPropertyPresets }
          />
        </label>
        {
          (selectedElementPropertyPreset.value === 'custom') ?
            <ValidationWrapper
              type="customElementProperty"
              error={ customElementProperty.touched && customElementProperty.error }
            >
              <Textfield { ...customElementProperty } />
            </ValidationWrapper>
            : null
        }
      </div>
    </div>
  );
}

const formConfig = {
  fields: [
    'elementSelector',
    'selectedElementPropertyPreset',
    'customElementProperty',
    'elementPropertyPresets'
  ],
  settingsToFormValues(values, options) {
    const { elementSelector, elementProperty } = options.settings;

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

export default extensionViewReduxForm(formConfig)(DOM);
