import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

class PreviousConverter extends React.Component {
  onOpenDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(this.props.fields.dataElement.onChange);
  };

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
          <Coral.Textfield ref="dataElementField" {...dataElement}/>
          <DataElementSelectorButton ref="dataElementButton"
            onClick={this.onOpenDataElementSelector}/>
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
