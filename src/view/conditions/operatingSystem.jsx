import React from 'react';
import { Field } from 'redux-form';
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

const OperatingSystem = () =>
  (<Field
    name="operatingSystems"
    component={ CheckboxList }
    options={ operatingSystemOptions }
  />);

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
      operatingSystems: values.operatingSystems || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(OperatingSystem);
