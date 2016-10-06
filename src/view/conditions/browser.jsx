import React from 'react';
import { Field } from 'redux-form';
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

const Browser = () =>
  (<Field name="browsers" component={ CheckboxList } options={ browserOptions } />);

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
      browsers: values.browsers || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(Browser);

