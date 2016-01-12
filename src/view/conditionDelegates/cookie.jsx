import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

export class Cookie extends React.Component {
  render() {
    const { name, value, valueIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={name.touched && name.error}>
          <label>
            <span className="u-label">Cookie Name:</span>
            <Coral.Textfield {...name}/>
          </label>
        </ValidationWrapper>
        <ValidationWrapper className="u-gapRight" error={value.touched && value.error}>
          <label>
            <span className="u-label">Cookie Value:</span>
            <Coral.Textfield {...value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          setValue={value.onChange}
          setValueIsRegex={valueIsRegex.onChange}/>
      </div>
    );
  }
}

const fields = [
  'name',
  'value',
  'valueIsRegex'
];

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Please specify a cookie name.';
  }

  if (!values.value) {
    errors.value = 'Please specify a cookie value.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(Cookie);
