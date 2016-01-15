import React from 'react';
import Coral from '../../reduxFormCoralUI';
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
          <Coral.Textfield ref="elementSelectorField" {...elementSelector}/>
        </label>
      </ValidationWrapper>
    );
  }
}
