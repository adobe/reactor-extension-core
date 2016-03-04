import React from 'react';
import Coral from 'coralui-support-reduxform';
import ValidationWrapper from '../components/validationWrapper';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Cookie extends React.Component {
  render() {
    const name = this.props.fields.name;

    return (
      <ValidationWrapper ref="nameWrapper" error={name.touched && name.error}>
        <label>
          <span className="u-label">Cookie Name</span>
          <Coral.Textfield ref="nameField" {...name}/>
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
