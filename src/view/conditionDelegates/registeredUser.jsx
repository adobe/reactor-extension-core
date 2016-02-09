import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';

class RegisteredUser extends React.Component {
  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper className="u-gapRight" error={dataElement.touched && dataElement.error}>
        <label>
          <span className="u-label">Data element identifying whether the user is registered:</span>
          <DataElementNameField {...dataElement}/>
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
