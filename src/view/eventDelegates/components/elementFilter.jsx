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
  'showSpecificElementsFilter',
  'showElementPropertiesFilter'
]
.concat(elementSelectorFieldFields)
.concat(elementPropertiesEditorFields);

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
  toValues: reduceReducers(
    elementPropertiesEditorReducers.toValues,
    (values, options) => {
      const { config: { elementSelector, elementProperties }, configIsNew } = options;

      return {
        ...values,
        showSpecificElementsFilter: Boolean(configIsNew || elementSelector || elementProperties),
        showElementPropertiesFilter: Boolean(elementProperties)
      };
    }
  ),
  toConfig: reduceReducers(
    elementPropertiesEditorReducers.toConfig,
    (config, values) => {
      config = {
        ...config
      };

      let { showSpecificElementsFilter, showElementPropertiesFilter } = values;

      if (!showSpecificElementsFilter) {
        delete config.elementSelector;
      }

      if (!showSpecificElementsFilter || !showElementPropertiesFilter) {
        delete config.elementProperties;
      }

      delete config.showSpecificElementsFilter;
      delete config.showElementPropertiesFilter;

      return config;
    }
  ),
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
