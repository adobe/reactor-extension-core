import React from 'react';
import ElementPropertyEditor from './elementPropertyEditor';
import createId from '../../utils/createId';
import Button from '@coralui/react-coral/lib/Button';

export default class ElementPropertiesEditor extends React.Component {
  add = () => {
    this.props.fields.elementProperties.addField({
      id: createId(),
      name: '',
      value: ''
    });
  };

  handleKeyPress = event => {
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      this.add();
    }
  };

  remove = index => {
    this.props.fields.elementProperties.removeField(index);
  };

  render() {
    const { elementProperties } = this.props.fields;

    return (
      <div>
        {
          elementProperties.map((elementProperty, index) => (
            <ElementPropertyEditor
              key={ elementProperty.id.value }
              fields={ elementProperty }
              remove={ this.remove.bind(null, index) }
              onKeyPress={ this.handleKeyPress }
            />
          ))
        }
        <Button onClick={ this.add }>Add</Button>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'elementProperties[].id',
    'elementProperties[].name',
    'elementProperties[].value',
    'elementProperties[].valueIsRegex'
  ],
  settingsToFormValues(values, options) {
    const { settings } = options;

    const elementProperties = settings.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    // ID used as a key when rendering each item.
    elementProperties.forEach(elementProperty => { elementProperty.id = createId(); });

    return {
      ...values,
      elementProperties
    };
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    let { elementProperties } = values;

    elementProperties = elementProperties
      .filter(elementProperty => elementProperty.name)
      .map(elementProperty => {
        elementProperty = {
          ...elementProperty
        };

        // ID is only used for view rendering.
        delete elementProperty.id;

        return elementProperty;
      });

    if (elementProperties.length) {
      settings.elementProperties = elementProperties;
    } else {
      delete settings.elementProperties;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    errors.elementProperties = values.elementProperties.map((item) => {
      const result = {};

      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    return errors;
  }
};
