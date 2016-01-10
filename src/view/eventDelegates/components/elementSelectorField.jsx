import React from 'react';
import Coral from 'coralui-support-react';
import ValidationWrapper from '../../components/validationWrapper';

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

export let validate = values => {
  const errors = {};

  if (!values.elementSelector) {
    errors.elementSelector = 'Please specify a selector. ' +
      'Alternatively, choose to target any element above.';
  }

  return errors;
};
