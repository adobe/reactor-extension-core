import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import extensionViewReduxForm from '../extensionViewReduxForm';

class Variable extends React.Component {
  render() {
    const { path } = this.props.fields;

    return (
      <ValidationWrapper ref="pathWrapper" error={path.touched && path.error}>
        <label>
          <span className="u-label">Path to variable</span>
          <Coral.Textfield ref="pathField" {...path}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const formConfig = {
  fields: [
    'path'
  ],
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (!values.path) {
      errors.path = 'Please specify a variable path.';
    }

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Variable);
