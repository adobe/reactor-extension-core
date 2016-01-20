import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';

export class LoggedIn extends React.Component {
  render() {
    const { dataElement } = this.props.fields;

    return (
      <ValidationWrapper className="u-gapRight" error={dataElement.touched && dataElement.error}>
        <label>
          <span className="u-label">Data element identifying whether the user is logged in:</span>
          <DataElementNameField {...dataElement}/>
        </label>
      </ValidationWrapper>
    );
  }
}

const fields = [
  'dataElement'
];

const validate = values => {
  const errors = {};

  if (!values.dataElement) {
    errors.dataElement = 'Please specify a data element.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(LoggedIn);
