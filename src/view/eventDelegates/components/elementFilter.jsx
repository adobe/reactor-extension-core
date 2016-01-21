import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementSelectorField, {
  fields as elementSelectorFieldFields
} from './elementSelectorField';
import ElementPropertiesEditor, {
  fields as elementPropertiesEditorFields,
  reducers as elementPropertiesEditorReducers
} from './elementPropertiesEditor';
import reduceReducers from 'reduce-reducers';

export const fields = [
  'elementSpecificity',
  'showElementPropertiesFilter'
]
.concat(elementSelectorFieldFields)
.concat(elementPropertiesEditorFields);

export default class ElementFilter extends React.Component {

  render() {
    const {
      elementSpecificity,
      showElementPropertiesFilter,
      elementSelector,
      elementProperties
    } = this.props;

    return (
      <div>
        <span className="u-label">On</span>
        <Coral.Radio
            ref ="specificElementsRadio"
            {...elementSpecificity}
            value="specific"
            checked={elementSpecificity.value === 'specific'}>
          specific elements
        </Coral.Radio>
        <Coral.Radio
            ref ="anyElementRadio"
            {...elementSpecificity}
            value="any"
            checked={elementSpecificity.value === 'any'}>
          any element
        </Coral.Radio>
        {
          elementSpecificity.value === 'specific' ?
            <div ref="specificElementFields">
              <ElementSelectorField elementSelector={elementSelector}/>
              <div>
                <Coral.Checkbox
                  ref="showElementPropertiesCheckbox"
                  {...showElementPropertiesFilter}>
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

export const reducers = {
  configToFormValues: reduceReducers(
    elementPropertiesEditorReducers.configToFormValues,
    (values, options) => {
      const { config: { elementSelector, elementProperties }, configIsNew } = options;

      return {
        ...values,
        elementSpecificity: configIsNew || elementSelector || elementProperties ?
          'specific' : 'any',
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    }
  ),
  formValuesToConfig: reduceReducers(
    elementPropertiesEditorReducers.formValuesToConfig,
    (config, values) => {
      config = {
        ...config
      };

      let { elementSpecificity, showElementPropertiesFilter } = values;

      if (elementSpecificity === 'any') {
        delete config.elementSelector;
      }

      if (elementSpecificity === 'any' || !showElementPropertiesFilter) {
        delete config.elementProperties;
      }

      delete config.elementSpecificity;
      delete config.showElementPropertiesFilter;

      return config;
    }
  ),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (values.elementSpecificity === 'specific' && !values.elementSelector) {
      errors.elementSelector = 'Please specify a selector. ' +
      'Alternatively, choose to target any element above.'
    }

    const elementPropertiesErrors = values.elementProperties.map((item) => {
      var result = {};
      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    if (elementPropertiesErrors.some(x => x)) {
      errors.elementProperties = elementPropertiesErrors;
    }

    return errors;
  }
};
