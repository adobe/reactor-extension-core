import React from 'react';

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

const DeviceType = ({ ...props }) => {
  const { deviceTypes } = props.fields;
  return (<CheckboxList
    options={ deviceTypeOptions }
    { ...deviceTypes }
  />);
};

const formConfig = {
  fields: ['deviceTypes'],
  settingsToFormValues(values, options) {
    return {
      ...values,
      ...options.settings
    };
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings,
      ...values,
      deviceTypes: values.deviceTypes || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(DeviceType);
