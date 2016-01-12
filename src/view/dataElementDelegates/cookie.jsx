import React from 'react';
import Coral from '../reduxFormCoralUI';
import ValidationWrapper from '../components/validationWrapper';
import extensionReduxForm from '../extensionReduxForm';

const fields = ['name'];

export class Cookie extends React.Component {
  render() {
    const name = this.props.fields.name;

    return (
      <ValidationWrapper error={name.touched && name.error}>
        <label>
          <span className="u-label">Cookie Name:</span>
          <Coral.Textfield {...name}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Please specify a cookie name.';
  }

  return errors;
};

export default extensionReduxForm({
  fields,
  validate
})(Cookie);
