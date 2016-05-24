import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
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

class DeviceType extends React.Component {
  render() {
    const { deviceTypes } = this.props.fields;
    return <CheckboxList
      ref="deviceOptionsCheckboxList"
      options={deviceTypeOptions}
      {...deviceTypes}/>;
  }
}

const formConfig = {
  fields: ['deviceTypes'],
  formValuesToSettings(settings, values) {
    return {
      deviceTypes: values.deviceTypes || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(DeviceType);
