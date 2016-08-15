import React from 'react';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import createId from '../utils/createId';
import MultipleItemEditor from './components/multipleItemEditor';

class Subdomain extends React.Component {
  getKey = subdomain => subdomain.id.value;
  removeRow = index => this.props.fields.subdomains.removeField(index);
  addRow = () => this.props.fields.subdomains.addField({ id: createId() });

  renderItem = (subdomain) => (
    <div className="u-inlineBlock">
      <ValidationWrapper
        className="u-gapRight"
        error={ subdomain.value.touched && subdomain.value.error }
      >
        <label>
          <span className="u-label">Subdomain</span>
          <Textfield { ...subdomain.value } />
        </label>
      </ValidationWrapper>
      <RegexToggle
        value={ subdomain.value.value }
        valueIsRegex={ subdomain.valueIsRegex.value }
        onValueChange={ subdomain.value.onChange }
        onValueIsRegexChange={ subdomain.valueIsRegex.onChange }
      />
    </div>
  );

  render() {
    const { subdomains } = this.props.fields;

    return (
      <MultipleItemEditor
        items={ subdomains }
        renderItem={ this.renderItem }
        getKey={ this.getKey }
        onAddItem={ this.addRow }
        onRemoveItem={ this.removeRow }
      />
    );
  }
}

const formConfig = {
  fields: [
    'subdomains[].id',
    'subdomains[].value',
    'subdomains[].valueIsRegex'
  ],
  settingsToFormValues(values) {
    values = {
      ...values
    };

    if (!values.subdomains) {
      values.subdomains = [];
    }

    if (!values.subdomains.length) {
      values.subdomains.push({});
    }

    values.subdomains = values.subdomains.map(subdomain => ({
      ...subdomain,
      id: createId()
    }));

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

    const subdomainsErrors = values.subdomains.map(subdomain => {
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
