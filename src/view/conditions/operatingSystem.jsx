import React from 'react';

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

const OperatingSystem = ({ ...props }) => {
  const { operatingSystems } = props.fields;
  return (<CheckboxList
    options={ operatingSystemOptions }
    { ...operatingSystems }
  />);
};

const formConfig = {
  fields: ['operatingSystems'],
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
