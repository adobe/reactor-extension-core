import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';

class DirectCall extends React.Component {
  render() {
    const { name } = this.props.fields;

    return (
      <ValidationWrapper error={name.touched && name.error}>
        <label>
          <span className="u-label coral-Form-fieldlabel">String</span>
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
      errors.name = 'Please specify a rule name.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(DirectCall);
