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
  formValuesToSettings(settings, values) {
    return {
      operatingSystems: values.operatingSystems || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(OperatingSystem);
