import React from 'react';
import Coral from 'coralui-support-reduxform';
import SpecificElements, { formConfig as specificElementsFormConfig } from './specificElements';
import reduceReducers from 'reduce-reducers';

export default class ElementFilter extends React.Component {

  render() {
    const { elementSpecificity } = this.props.fields;

    return (
      <div>
        <div>
          <Coral.Radio
              ref="specificElementsRadio"
              {...elementSpecificity}
              value="specific"
              checked={elementSpecificity.value === 'specific'}>
            specific elements
          </Coral.Radio>
          <Coral.Radio
              ref="anyElementRadio"
              {...elementSpecificity}
              value="any"
              checked={elementSpecificity.value === 'any'}>
            any element
          </Coral.Radio>
        </div>
        {
          elementSpecificity.value === 'specific' ?
            <SpecificElements ref="specificElements" fields={this.props.fields}/> : null
        }
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'elementSpecificity'
  ].concat(specificElementsFormConfig.fields),
  settingsToFormValues: reduceReducers(
    specificElementsFormConfig.settingsToFormValues,
    (values, options) => {
      const { settings: { elementSelector, elementProperties }, settingsIsNew } = options;

      return {
        ...values,
        elementSpecificity: settingsIsNew || elementSelector || elementProperties ?
          'specific' : 'any'
      };
    }
  ),
  formValuesToSettings: reduceReducers(
    specificElementsFormConfig.formValuesToSettings,
    (settings, values) => {
      settings = {
        ...settings
      };

      let { elementSpecificity } = values;

      if (elementSpecificity === 'any') {
        delete settings.elementSelector;
        delete settings.elementProperties;
      }

      delete settings.elementSpecificity;

      return settings;
    }
  ),
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.elementSpecificity === 'specific') {
      errors = specificElementsFormConfig.validate(errors, values);
    }

    return errors;
  }
};
