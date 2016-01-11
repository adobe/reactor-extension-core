import React from 'react';
import Coral from 'coralui-support-react';
import ValidationWrapper from '../components/validationWrapper';
import extensionReduxForm from '../extensionReduxForm';

const fields = ['name'];

export class Cookie extends React.Component {
  render() {
    const { fields: { name } } = this.props;

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

let validate = values => {
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
