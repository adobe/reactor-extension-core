import React from 'react';
import Coral from 'coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';
import createId from '../utils/createId';
import MultipleItemEditor from './components/multipleItemEditor';

class Subdomain extends React.Component {
  addRow = () => this.props.fields.subdomains.addField({ id: createId() });
  removeRow = index => this.props.fields.subdomains.removeField(index);
  getKey = subdomain => subdomain.id.value;

  renderItem = (subdomain, index) => {
    return (
      <div className="u-inlineBlock">
        <ValidationWrapper
          ref={`subdomainWrapper${index}`}
          className="u-gapRight"
          error={subdomain.value.touched && subdomain.value.error}>
          <label>
            <span className="u-label">Subdomain</span>
            <Coral.Textfield ref={`subdomainField${index}`} {...subdomain.value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          ref={`subdomainRegexToggle${index}`}
          value={subdomain.value.value}
          valueIsRegex={subdomain.valueIsRegex.value}
          onValueChange={subdomain.value.onChange}
          onValueIsRegexChange={subdomain.valueIsRegex.onChange}/>
      </div>
    );
  };

  render() {
    const { subdomains } = this.props.fields;

    return (
      <MultipleItemEditor
        ref="multipleItemEditor"
        items={subdomains}
        renderItem={this.renderItem}
        getKey={this.getKey}
        onAddItem={this.addRow}
        onRemoveItem={this.removeRow}/>
    );

  }
}

const formConfig = {
  fields: [
    'subdomains[].id',
    'subdomains[].value',
    'subdomains[].valueIsRegex'
  ],
  settingsToFormValues(values, options) {
    values = {
      ...values
    };

    if (!values.subdomains) {
      values.subdomains = [];
    }

    if (!values.subdomains.length) {
      values.subdomains.push({});
    }

    values.subdomains = values.subdomains.map(subdomain => {
      return {
        ...subdomain,
        id: createId()
      };
    });

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    settings.subdomains = values.subdomains.map(subdomain => {
      // Don't let ID get into the settings since it's only used in the view.
      return {
        value: subdomain.value,
        valueIsRegex: subdomain.valueIsRegex
      };
    });

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
