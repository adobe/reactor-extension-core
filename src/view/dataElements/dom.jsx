import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';

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
          <Field
            name="elementSelector"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            supportCssSelector
          />
        </label>
      </div>
      <div>
        <label className="u-gapRight">
          <span className="u-label">Use the value of</span>
          <Field
            name="selectedElementPropertyPreset"
            component={ Select }
            options={ elementPropertyPresets }
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
