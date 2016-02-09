import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Cookie extends React.Component {
  render() {
    const name = this.props.fields.name;

    return (
      <ValidationWrapper error={name.touched && name.error}>
        <label>
          <span className="u-label coral-Form-fieldlabel">Cookie Name</span>
          <Coral.Textfield {...name}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: ['name'],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.name) {
      errors.name = 'Please specify a cookie name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Cookie);
