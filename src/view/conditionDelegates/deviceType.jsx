import React from 'react';
import Coral from '../reduxFormCoralUI';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

const deviceTypeOptions = [
  'Desktop',
  'iPhone',
  'iPad',
  'iPod',
  'Nokia',
  'Windows Phone',
  'Blackberry',
  'Android'
];

export class DeviceType extends React.Component {
  render() {
    const { deviceTypes } = this.props.fields;
    return <CheckboxList options={deviceTypeOptions} {...deviceTypes}/>;
  }
}

const fields = ['deviceTypes'];

export default extensionViewReduxForm({
  fields
})(DeviceType);

export const reducers = {
  formValuesToConfig(config, values) {
    return {
      deviceTypes: values.deviceTypes || [] // An array is required.
    };
  }
};
