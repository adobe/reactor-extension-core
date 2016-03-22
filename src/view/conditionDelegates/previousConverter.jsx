import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper, DataElementField } from '@reactor/react-components';

class PreviousConverter extends React.Component {
  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper
        ref="dataElementWrapper"
        className="u-gapRight"
        error={dataElement.touched && dataElement.error}>
        <label>
          <span className="u-label">
            Data element identifying whether the user is a previous converter
          </span>
          <DataElementField ref="dataElementField" {...dataElement}
            nameOnly="true"
            onOpenSelector={window.extensionBridge.openDataElementSelector}/>
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
