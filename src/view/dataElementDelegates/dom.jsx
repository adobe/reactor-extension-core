import React from 'react';
import Coral from '../reduxFormCoralUI';
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
          <ValidationWrapper error={elementSelector.touched && elementSelector.error}>
            <label>
              <span className="u-label">From the DOM element matching the CSS Selector</span>
              <Coral.Textfield {...elementSelector}/>
            </label>
          </ValidationWrapper>
        </div>
        <div>
          <label>
            <span className="u-label">Use the value of</span>
            <Coral.Select {...selectedElementPropertyPreset} className="u-gapRight">
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
            <ValidationWrapper error={customElementProperty.touched && customElementProperty.error}>
              <Coral.Textfield {...customElementProperty}/>
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
  configToFormValues(values, options) {
    let { elementSelector, elementProperty } = options.config;

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

  formValuesToConfig(config, values) {
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
