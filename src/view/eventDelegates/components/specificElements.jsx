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
  'showElementPropertiesFilter'
]
.concat(elementSelectorFieldFields)
.concat(elementPropertiesEditorFields);

export default class SpecificElements extends React.Component {

  render() {
    const {
      showElementPropertiesFilter
    } = this.props.fields;

    return (
      <div ref="specificElementFields">
        <ElementSelectorField fields={this.props.fields}/>
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
              fields={this.props.fields}/> : null
          }
        </div>
      </div>
    );
  }
}

export const reducers = {
  configToFormValues: reduceReducers(
    elementPropertiesEditorReducers.configToFormValues,
    (values, options) => {
      const { elementProperties } = options.config;

      return {
        ...values,
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

      let { showElementPropertiesFilter } = values;

      if (!showElementPropertiesFilter) {
        delete config.elementProperties;
      }

      delete config.showElementPropertiesFilter;

      return config;
    }
  ),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (!values.elementSelector) {
      errors.elementSelector = 'Please specify a CSS selector.';
    }

    if (values.showElementPropertiesFilter) {
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
    }

    return errors;
  }
};
