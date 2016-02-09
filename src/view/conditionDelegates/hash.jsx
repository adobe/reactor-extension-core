import React from 'react';
import Coral from '../reduxFormCoralUI';
import extensionViewReduxForm from '../extensionViewReduxForm';
import RegexToggle from '../components/regexToggle';
import ValidationWrapper from '../components/validationWrapper';
import createID from '../utils/createID';
import MultipleItemEditor from './components/multipleItemEditor';

class Hash extends React.Component {
  addRow = () => this.props.fields.hashes.addField({ id: createID() });
  removeRow = index => this.props.fields.hashes.removeField(index);
  getKey = hash => hash.id.value;

  renderItem = hash => {
    return (
      <div className="u-inlineBlock">
        <ValidationWrapper className="u-gapRight" error={hash.value.touched && hash.value.error}>
          <label>
            <span className="u-label coral-Form-fieldlabel">Hash</span>
            <Coral.Textfield {...hash.value}/>
          </label>
        </ValidationWrapper>
        <RegexToggle
          value={hash.value.value}
          valueIsRegex={hash.valueIsRegex.value}
          onValueChange={hash.value.onChange}
          onValueIsRegexChange={hash.valueIsRegex.onChange}/>
      </div>
    );
  };

  render() {
    const { hashes } = this.props.fields;

    return (
      <MultipleItemEditor
        items={hashes}
        renderItem={this.renderItem}
        getKey={this.getKey}
        onAddItem={this.addRow}
        onRemoveItem={this.removeRow}/>
    );

  }
}

const formConfig = {
  fields: [
    'hashes[].id',
    'hashes[].value',
    'hashes[].valueIsRegex'
  ],
  configToFormValues(values, options) {
    values = {
      ...values
    };

    if (!values.hashes) {
      values.hashes = [];
    }

    if (!values.hashes.length) {
      values.hashes.push({});
    }

    values.hashes = values.hashes.map(hash => {
      return {
        ...hash,
        id: createID()
      };
    });

    return values;
  },
  formValuesToConfig(config, values) {
    config = {
      ...config
    };

    config.hashes = values.hashes.map(hash => {
      // Don't let ID get into the config since it's only used in the view.
      return {
        value: hash.value,
        valueIsRegex: hash.valueIsRegex
      };
    });

    return config;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    const hashesErrors = values.hashes.map(hash => {
      const result = {};

      if (!hash.value) {
        result.value = 'Please specify a hash.';
      }

      return result;
    });

    errors.hashes = hashesErrors;

    return errors;
  }
};

export default extensionViewReduxForm(formConfig)(Hash);
