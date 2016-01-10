import React from 'react';
import Coral from 'coralui-support-react';
import ValidationWrapper from '../../components/validationWrapper';

export const fields = [
  'elementSelector'
];

export default class ElementSelectorField extends React.Component {
  render() {
    const { elementSelector } = this.props;

    return (
      <ValidationWrapper error={elementSelector.touched && elementSelector.error}>
        <label>
          <span className="u-label">matching the CSS selector</span>
          <Coral.Textfield {...elementSelector}/>
        </label>
      </ValidationWrapper>
    );
  }
}

export let reducers = {
  toValues: (values, options) => {
    const { elementSelector } = options.config;

    return {
      ...values,
      elementSelector
    };
  },
  toConfig: (config, values) => {
    config = {
      ...config
    };

    let { elementSelector } = values;

    if (elementSelector) {
      config.elementSelector = elementSelector;
    }

    return config;
  }
};
