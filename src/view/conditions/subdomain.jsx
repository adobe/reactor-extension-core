import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Fields, FieldArray } from 'redux-form';

import Field from '../components/field';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import MultipleItemEditor from './components/multipleItemEditor';

const renderItem = (field) => (
  <div className="u-inlineBlock">
    <label className="u-gapRight">
      <span className="u-label">Subdomain</span>
      <Field
        name={ `${field}.value` }
        component={ Textfield }
        supportValidation
      />
    </label>
    <Fields
      names={ [`${field}.value`, `${field}.valueIsRegex`] }
      component={ RegexToggle }
    />
  </div>
);

const Subdomain = () => (
  <FieldArray
    name="subdomains"
    renderItem={ renderItem }
    component={ MultipleItemEditor }
  />
);

const formConfig = {
  settingsToFormValues(values, settings) {
    values = {
      ...values,
      ...settings
    };

    if (!values.subdomains) {
      values.subdomains = [];
    }

    if (!values.subdomains.length) {
      values.subdomains.push({});
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    // Don't let ID get into the settings since it's only used in the view.
    settings.subdomains = values.subdomains.map(subdomain => ({
      value: subdomain.value,
      valueIsRegex: subdomain.valueIsRegex
    }));

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const subdomainsErrors = (values.subdomains || []).map(subdomain => {
      const result = {};

      if (!subdomain.value) {
        result.value = 'Please specify a subdomain.';
      }

      return result;
    });

    errors.subdomains = subdomainsErrors;

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Subdomain);
