import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import { List } from 'immutable';
import { 
  addElementProperty, 
  editElementProperty, 
  removeElementProperty 
} from '../actions/elementFilterActions';
import { connect } from 'react-redux';

@connect(state => ({
  elementProperties: state.get('elementProperties')
}))
export default class ElementPropertiesEditor extends React.Component {
  add = () => {
    this.props.dispatch(addElementProperty({
      name: '',
      value: ''
    }));
  };

  setName = (elementProperty, name) => {
    this.props.dispatch(editElementProperty({
      elementProperty,
      props: {
        name
      }
    }));
  };

  setValue = (elementProperty, value) => {
    this.props.dispatch(editElementProperty({
      elementProperty,
      props: {
        value
      }
    }));
  };

  setValueIsRegex = (elementProperty, valueIsRegex) => {
    this.props.dispatch(editElementProperty({
      elementProperty,
      props: {
        valueIsRegex
      }
    }));
  };

  remove = elementProperty => {
    this.props.dispatch(removeElementProperty(elementProperty));
  };
  
  render() {
    return (
      <div>
        {this.props.elementProperties.map(property => {
          return <ElementPropertyEditor
            key={property.get('id')}
            name={property.get('name')}
            value={property.get('value')}
            valueIsRegex={property.get('valueIsRegex')}
            setName={this.setName.bind(null, property)}
            setValue={this.setValue.bind(null, property)}
            setValueIsRegex={this.setValueIsRegex.bind(null, property)}
            remove={this.remove.bind(null, property)}
            removable={this.props.elementProperties.size > 1}
            />
        })}
        <Coral.Button onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}
