import React from 'react';
import Coral from '../../reduxFormCoralUI';
import SpecificElements, {
  fields as specificElementsFields,
  reducers as specificElementsReducers
} from './specificElements';
import reduceReducers from 'reduce-reducers';

export const fields = [
  'elementSpecificity'
]
.concat(specificElementsFields);

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
            <SpecificElements fields={this.props.fields}/> : null
        }
      </div>
    );
  }
}

export const reducers = {
  configToFormValues: reduceReducers(
    specificElementsReducers.configToFormValues,
    (values, options) => {
      const { config: { elementSelector, elementProperties }, configIsNew } = options;

      return {
        ...values,
        elementSpecificity: configIsNew || elementSelector || elementProperties ?
          'specific' : 'any'
      };
    }
  ),
  formValuesToConfig: reduceReducers(
    specificElementsReducers.formValuesToConfig,
    (config, values) => {
      config = {
        ...config
      };

      let { elementSpecificity } = values;

      if (elementSpecificity === 'any') {
        delete config.elementSelector;
        delete config.elementProperties;
      }

      delete config.elementSpecificity;

      return config;
    }
  ),
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    if (values.elementSpecificity === 'specific') {
      errors = specificElementsReducers.validate(errors, values);
    }

    return errors;
  }
};
