import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import CheckboxList from '../components/checkboxList';
import extensionViewReduxForm from '../extensionViewReduxForm';

const Domain = props =>
  (<Field name="domains" component={ CheckboxList } options={ props.domainOptions } />);

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
      domains: values.domains || [] // An array is required.
    };
  }
};

const stateToProps = state => ({
  domainOptions: state.meta.propertySettings ? state.meta.propertySettings.domains : []
});

export default extensionViewReduxForm(formConfig)(connect(stateToProps)(Domain));
