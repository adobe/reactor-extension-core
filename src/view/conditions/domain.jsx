import React from 'react';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

const Domain = ({ ...props }) => {
  const { domains } = props.fields;
  return (<CheckboxList
    options={ props.domainOptions }
    { ...domains }
  />);
};

const formConfig = {
  fields: ['domains'],
  formValuesToSettings(settings, values) {
    return {
      domains: values.domains || [] // An array is required.
    };
  }
};

const stateToProps = state => ({
  domainOptions: state.propertySettings ? state.propertySettings.domainList : []
});

export default extensionViewReduxForm(formConfig, stateToProps)(Domain);
