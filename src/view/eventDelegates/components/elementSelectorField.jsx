import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ValidationWrapper from '../../components/validationWrapper';

export default class ElementSelectorField extends React.Component {
  render() {
    const { elementSelector } = this.props.fields;

    return (
      <ValidationWrapper
        ref="validationWrapper"
        error={elementSelector.touched && elementSelector.error}>
        <label>
          <span className="u-label">Elements matching the CSS selector</span>
          <Coral.Textfield ref="textfield" {...elementSelector}/>
        </label>
      </ValidationWrapper>
    );
  }
}

export const formConfig = {
  fields: [
    'elementSelector'
  ]
};
