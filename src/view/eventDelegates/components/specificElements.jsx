import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementSelectorField, { formConfig as elementSelectorFieldFormConfig } from './elementSelectorField';
import ElementPropertiesEditor, { formConfig as elementPropertiesEditorFormConfig } from './elementPropertiesEditor';
import reduceReducers from 'reduce-reducers';

export default class SpecificElements extends React.Component {
  render() {
    const {
      showElementPropertiesFilter
    } = this.props.fields;

    return (
      <div>
        <ElementSelectorField ref="elementSelectorField" fields={this.props.fields}/>
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

export const formConfig = {
  fields: [
    'showElementPropertiesFilter'
  ].concat(elementSelectorFieldFormConfig.fields, elementPropertiesEditorFormConfig.fields),
  configToFormValues: reduceReducers(
    elementPropertiesEditorFormConfig.configToFormValues,
    (values, options) => {
      const { elementProperties } = options.config;

      return {
        ...values,
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    }
  ),
  formValuesToConfig: reduceReducers(
    elementPropertiesEditorFormConfig.formValuesToConfig,
    (config, values) => {
      config = {
        ...config
      };

      if (!values.showElementPropertiesFilter) {
        delete config.elementProperties;
      }

      delete config.showElementPropertiesFilter;

      return config;
    }
  ),
  validate: reduceReducers(
    elementPropertiesEditorFormConfig.validate,
    (errors, values) => {
      errors = {
        ...errors
      };

      if (!values.elementSelector) {
        errors.elementSelector = 'Please specify a CSS selector.';
      }

      if (!values.showElementPropertiesFilter) {
        delete errors.elementProperties;
      }

      return errors;
    }
  )
};
