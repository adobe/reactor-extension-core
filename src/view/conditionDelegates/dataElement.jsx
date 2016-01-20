import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import ValidationWrapper from '../components/validationWrapper';
import DataElementNameField from './components/dataElementNameField';
import RegexToggle from '../components/regexToggle';

export class DataElement extends React.Component {
  render() {
    const { dataElement, value, valueIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={dataElement.touched && dataElement.error}>
          <label>
            <span className="u-label">Data element name</span>
            <DataElementNameField {...dataElement}/>
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
  'dataElement',
  'value',
  'valueIsRegex'
];

const validate = values => {
  const errors = {};

  if (!values.dataElement) {
    errors.dataElement = 'Please specify a data element.';
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
