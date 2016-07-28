import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import extensionViewReduxForm from '../extensionViewReduxForm';

const CookieOptOut = ({ ...props }) => {
  const { acceptsCookies } = props.fields;
  return (<Checkbox { ...acceptsCookies }>
    User accepts cookies (EU)
  </Checkbox>);
};

const formConfig = {
  fields: [
    'acceptsCookies'
  ]
};

export default extensionViewReduxForm(formConfig)(CookieOptOut);
