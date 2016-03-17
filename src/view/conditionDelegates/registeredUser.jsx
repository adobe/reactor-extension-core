import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import { ValidationWrapper } from '@reactor/react-components';
import DataElementNameField from './components/dataElementNameField';

class RegisteredUser extends React.Component {
  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper
        ref="dataElementWrapper"
        className="u-gapRight"
        error={dataElement.touched && dataElement.error}>
        <label>
          <span className="u-label">
            Data element identifying whether the user is registered
          </span>
          <DataElementNameField ref="dataElementField" {...dataElement}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: [ 'dataElement' ],
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

export default extensionViewReduxForm(formConfig)(RegisteredUser);
