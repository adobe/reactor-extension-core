import React from 'react';
import Coral from '../../reduxFormCoralUI';
import ElementPropertyEditor from './elementPropertyEditor';
import createID from '../../utils/createID';

export const fields = [
  'elementProperties[].id',
  'elementProperties[].name',
  'elementProperties[].value',
  'elementProperties[].valueIsRegex'
];

export default class ElementPropertiesEditor extends React.Component {
  add = () => {
    this.props.fields.elementProperties.addField({
      id: createID(),
      name: '',
      value: ''
    });
  };

  remove = index => {
    this.props.fields.elementProperties.removeField(index);
  };

  render() {
    const { elementProperties } = this.props.fields;

    return (
      <div>
        {elementProperties.map((elementProperty, index) => {
          return <ElementPropertyEditor
            key={elementProperty.id.value}
            fields={elementProperty}
            remove={this.remove.bind(null, index)}
            removable={elementProperties.length > 1}
            />;
        })}
        <Coral.Button ref="addButton" onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}

export const reducers = {
  configToFormValues(values, options) {
    const { config } = options;

    var elementProperties = config.elementProperties || [];

    // Make sure there's always at least one element property. This is just so the view
    // always shows at least one row.
    if (!elementProperties.length) {
      elementProperties.push({
        name: '',
        value: ''
      });
    }

    // ID used as a key when rendering each item.
    elementProperties.forEach(elementProperty => elementProperty.id = createID());

    return {
      ...values,
      elementProperties
    };
  },
  formValuesToConfig(config, values) {
    config = {
      ...config
    };

    let { elementProperties } = values;

    elementProperties = elementProperties.filter(elementProperty => {
      return elementProperty.name;
    }).map(elementProperty => {
      elementProperty = {
        ...elementProperty
      };

      // ID is only used for view rendering.
      delete elementProperty.id;

      return elementProperty;
    });

    if (elementProperties.length) {
      config.elementProperties = elementProperties;
    } else {
      delete config.elementProperties;
    }

    return config;
  },
  validate: (errors, values) => {
    errors = {
      ...errors
    };

    const elementPropertiesErrors = values.elementProperties.map((item) => {
      var result = {};

      if (item.value && !item.name) {
        result.name = 'Please fill in the property name.';
      }

      return result;
    });

    if (elementPropertiesErrors.some(x => x)) {
      errors.elementProperties = elementPropertiesErrors;
    }

    return errors;
  }
};
