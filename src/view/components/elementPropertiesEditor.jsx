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

let mapStateToProps = state => ({
  elementProperties: state.get('elementProperties')
});

class ElementPropertiesEditor extends React.Component {
  add = () => {
    this.props.dispatch(addElementProperty({
      name: '',
      value: ''
    }));
  };

  setName = (id, name) => {
    this.props.dispatch(editElementProperty({
      id,
      name
    }));
  };

  setValue = (id, value) => {
    this.props.dispatch(editElementProperty({
      id,
      value
    }));
  };

  setValueIsRegex = (id, valueIsRegex) => {
    this.props.dispatch(editElementProperty({
      id,
      valueIsRegex
    }));
  };

  remove = id => {
    this.props.dispatch(removeElementProperty(id));
  };
  
  render() {
    return (
      <div>
        {this.props.elementProperties.valueSeq().map((property) => {
          let id = property.get('id');
          return <ElementPropertyEditor
            key={id}
            name={property.get('name')}
            value={property.get('value')}
            valueIsRegex={property.get('valueIsRegex')}
            setName={this.setName.bind(null, id)}
            setValue={this.setValue.bind(null, id)}
            setValueIsRegex={this.setValueIsRegex.bind(null, id)}
            remove={this.remove.bind(null, id)}
            removable={this.props.elementProperties.size > 1}
            />
        }).toSeq()}
        <Coral.Button onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ElementPropertiesEditor)
