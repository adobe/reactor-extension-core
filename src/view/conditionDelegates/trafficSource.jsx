import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';

export class TrafficSource extends React.Component {
  render() {
    const { source, sourceIsRegex } = this.props.fields;

    return (
      <div>
        <ValidationWrapper className="u-gapRight" error={source.touched && source.error}>
          <label>
            <span className="u-label">Traffic Source</span>
            <Coral.Textfield {...source}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={source.value}
          valueIsRegex={sourceIsRegex.value}
          onValueChange={source.onChange}
          onValueIsRegexChange={sourceIsRegex.onChange}/>
      </div>
    );
  }
}

const fields = [
  'source',
  'sourceIsRegex'
];

const validate = values => {
  const errors = {};

  if (!values.source) {
    errors.source = 'Please specify a traffic source.';
  }

  return errors;
};

export default extensionViewReduxForm({
  fields,
  validate
})(TrafficSource);
