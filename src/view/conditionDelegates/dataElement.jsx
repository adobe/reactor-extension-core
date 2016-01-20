import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import RegexToggle from '../components/regexToggle';

export class DataElement extends React.Component {
  render() {
    const { name, value, valueIsRegex } = this.props.fields;

    console.log(name, valueIsRegex);

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={name.touched && name.error}>
          <label>
            <span className="u-label">Data element name</span>
            <DataElementNameField {...name}/>
          </label>
        </ValidationWrapper>
        <ValidationWrapper className="u-gapRight" error={value.touched && value.error}>
          <label>
            <span className="u-label">has the value</span>
            <Coral.Textfield {...value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={value.value}
          valueIsRegex={valueIsRegex.value}
          onValueChange={value.onChange}
          onValueIsRegexChange={valueIsRegex.onChange}/>
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
    errors.name = 'Please specify a data element.';
  }

  if (!values.value) {
    errors.value = 'Please specify a value';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(DataElement);
