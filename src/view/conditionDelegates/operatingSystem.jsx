import React from 'react';
import Coral from '../reduxFormCoralUI';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

const operatingSystemOptions = [
  'Windows',
  'MacOS',
  'Linux',
  'Unix',
  'Blackberry',
  'iOS',
  'Android',
  'Symbian OS',
  'Maemo'
];

export class OperatingSystem extends React.Component {
  render() {
    const { operatingSystems } = this.props.fields;
    return <CheckboxList options={operatingSystemOptions} {...operatingSystems}/>
  }
}

const fields = ['operatingSystems'];

export default extensionViewReduxForm({
  fields
})(OperatingSystem);

export const reducers = {
  formValuesToConfig(config, values) {
    return {
      operatingSystems: values.operatingSystems || [] // An array is required.
    }
  }
};

