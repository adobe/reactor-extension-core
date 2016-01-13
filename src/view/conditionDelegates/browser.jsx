import React from 'react';
import Coral from '../reduxFormCoralUI';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

const browserOptions = [
  'Chrome',
  'Firefox',
  'IE',
  'Safari',
  'Opera',
  'Mobile Safari',
  'IE Mobile',
  'Opera Mini',
  'Opera Mobile',
  'OmniWeb'
];

export class Browser extends React.Component {
  render() {
    const { browsers } = this.props.fields;
    return <CheckboxList options={browserOptions} {...browsers}/>
  }
}

const fields = ['browsers'];

export default extensionViewReduxForm({
  fields
})(Browser);

export const reducers = {
  stateToConfig(config, values) {
    return {
      browsers: values.browsers || [] // An array is required.
    }
  }
};

