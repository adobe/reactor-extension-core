import React from 'react';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../extensionViewReduxForm';

class PreviousConverter extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.dataElement.onChange);
  };

  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper
        className="u-gapRight"
        error={ dataElement.touched && dataElement.error }
      >
        <label>
          <span className="u-label">
            Data element identifying whether the user is a previous converter
          </span>
          <Textfield { ...dataElement } />
          <DataElementSelectorButton onClick={ this.onOpenDataElementSelector } />
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: ['dataElement'],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.dataElement) {
      errors.dataElement = 'Please specify a data element.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(PreviousConverter);
