import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from './elementPropertyEditor';
import createID from '../../utils/createID';

export default class ElementPropertiesEditor extends React.Component {
  add = event => {
    this.props.elementProperties.addField({
      id: createID(),
      name: '',
      value: ''
    });
  };

  remove = index => {
    this.props.elementProperties.removeField(index);
  };

  render() {
    const { elementProperties } = this.props;

    return (
      <div>
        {elementProperties.map((elementProperty, index) => {
          return <ElementPropertyEditor
            key={elementProperty.id.value}
            {...elementProperty}
            remove={this.remove.bind(null, index)}
            removable={elementProperties.length > 1}
            />
        })}
        <Coral.Button ref="addButton" onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}
