import React from 'react';
import { Field } from 'redux-form';
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

const DeviceType = () =>
  (<Field name="deviceTypes" component={ CheckboxList } options={ deviceTypeOptions } />);

const formConfig = {
  settingsToFormValues(values, settings) {
    return {
      ...values,
      ...settings
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
