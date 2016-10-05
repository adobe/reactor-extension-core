import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';

import CoralField from '../components/coralField';
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

const DOM = ({ ...props }) => {
  const { selectedElementPropertyPreset } = props;

  return (
    <div>
      <div className="u-gapBottom">
        <label>
          <span className="u-label">From the DOM element matching the CSS Selector</span>
          <CoralField
            name="elementSelector"
            component={ Textfield }
            supportValidation
            supportCssSelector
          />
        </label>
      </div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">Use the value of</span>
          <CoralField
            name="selectedElementPropertyPreset"
            component={ Select }
            options={ elementPropertyPresets }
          />
        </label>
        {
          (selectedElementPropertyPreset === 'custom') ?
            <CoralField
              name="customElementProperty"
              component={ Textfield }
              supportValidation
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

const ConnectedDOM = connect(stateToProps)(DOM);

const formConfig = {
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

export default extensionViewReduxForm(formConfig)(ConnectedDOM);
