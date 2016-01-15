import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';

export class DirectCall extends React.Component {
  render() {
    const { name } = this.props.fields;

    return (
      <ValidationWrapper error={name.touched && name.error}>
        <label>
          <span className="u-label">String:</span>
          <Coral.Textfield {...name}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const fields = ['name'];

const validate = function(values) {
  const errors = {};

  if (!values.name) {
    errors.name = 'Please specify a rule name.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(DirectCall);
