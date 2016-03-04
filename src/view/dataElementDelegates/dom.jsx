import React from 'react';
import Coral from 'coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';

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

class DOM extends React.Component {
  render() {
    const {
      fields: {
        elementSelector,
        selectedElementPropertyPreset,
        customElementProperty
      }
    } = this.props;

    return (
      <div>
        <div className="u-gapBottom">
          <ValidationWrapper
            ref="elementSelectorWrapper"
            error={elementSelector.touched && elementSelector.error}>
            <label>
              <span className="u-label">From the DOM element matching the CSS Selector</span>
              <Coral.Textfield ref="elementSelectorField" {...elementSelector}/>
            </label>
          </ValidationWrapper>
        </div>
        <div>
          <label>
            <span className="u-label">Use the value of</span>
            <Coral.Select
              ref="elementPropertyPresetsSelect"
              {...selectedElementPropertyPreset}
              className="u-gapRight">
              {
                elementPropertyPresets.map(preset => {
                  return (
                    <Coral.Select.Item key={preset.value} value={preset.value}>
                      {preset.label}
                    </Coral.Select.Item>
                  );
                })
              }
            </Coral.Select>
          </label>
          {
            (selectedElementPropertyPreset.value === 'custom') ?
            <ValidationWrapper
              ref="customElementPropertyWrapper"
              error={customElementProperty.touched && customElementProperty.error}>
              <Coral.Textfield ref="customElementPropertyField" {...customElementProperty}/>
            </ValidationWrapper>
            : null
          }
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [
    'elementSelector',
    'selectedElementPropertyPreset',
    'customElementProperty',
    'elementPropertyPresets'
  ],
  settingsToFormValues(values, options) {
    let { elementSelector, elementProperty } = options.settings;

    let elementPropertyIsPreset =
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
    let { selectedElementPropertyPreset, customElementProperty } = values;
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
