import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementSelectorField from './elementSelectorField';
import ElementPropertiesEditor from './elementPropertiesEditor';
import createID from '../../utils/createID';

export let fields = [
  'showSpecificElementsFilter',
  'showElementPropertiesFilter',
  'elementSelector',
  'elementProperties[].id',
  'elementProperties[].name',
  'elementProperties[].value',
  'elementProperties[].valueIsRegex'
];

export default class ElementFilter extends React.Component {

  render() {
    const {
      showSpecificElementsFilter,
      showElementPropertiesFilter,
      elementSelector,
      elementProperties
    } = this.props;

    return (
      <div>
        <span className="u-label">On</span>
        <Coral.Radio
            name="filter"
            value="true"
            checked={showSpecificElementsFilter.checked}
            onChange={event => showSpecificElementsFilter.onChange(true)}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            name="filter"
            value="false"
            checked={!showSpecificElementsFilter.checked}
            onChange={event => showSpecificElementsFilter.onChange(false)}>
          any element
        </Coral.Radio>
        {
          showSpecificElementsFilter.value ?
            <div ref="specificElementFields">
              <ElementSelectorField elementSelector={elementSelector}/>
              <div>
                <Coral.Checkbox {...showElementPropertiesFilter}>
                  and having certain property values...
                </Coral.Checkbox>
                {
                  showElementPropertiesFilter.value ?
                  <ElementPropertiesEditor
                    ref="elementPropertiesEditor"
                    elementProperties={elementProperties}/> : null
                }
              </div>
            </div> : null
        }
      </div>
    );
  }
}

export let reducers = {
  toValues: (values, options) => {
    values = {
      ...values
    };
    
    const { config, configIsNew } = options;

    values.showSpecificElementsFilter =
      Boolean(configIsNew || config.elementSelector || config.elementProperties);
    values.showElementPropertiesFilter = Boolean(config.elementProperties);
    values.elementSelector = config.elementSelector;

    var elementProperties = config.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    elementProperties.forEach(elementProperty => elementProperty.id = createID());

    values.elementProperties = elementProperties;

    return values;
  },
  toConfig: (config, values) => {
    config = {
      ...config
    };

    let {
      showSpecificElementsFilter,
      showElementPropertiesFilter,
      elementSelector,
      elementProperties
    } = values;

    if (showSpecificElementsFilter) {
      if (elementSelector) {
        config.elementSelector = elementSelector;
      }

      if (showElementPropertiesFilter) {
        if (elementProperties) {
          elementProperties = elementProperties.filter(elementProperty => {
            return elementProperty.name;
          }).map(elementProperty => {
            const { name, value, valueIsRegex } = elementProperty;

            elementProperty = {
              name,
              value
            };

            if (valueIsRegex) {
              elementProperty.valueIsRegex = true;
            }

            return elementProperty;
          });

          if (elementProperties.length) {
            config.elementProperties = elementProperties;
          }
        }
      }
    }

    return config;
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (values.showSpecificElementsFilter && !values.elementSelector) {
      errors.elementSelector = 'Please specify a selector. ' +
      'Alternatively, choose to target any element above.'
    }

    return errors;
  }
};
