import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import { List } from 'immutable';
import { actionCreators } from '../actions/common/elementFilterActions';
import { connect } from 'react-redux';

export let mapStateToProps = state => ({
  elementProperties: state.get('elementProperties')
});

export class ElementPropertiesEditor extends React.Component {
  add = () => {
    this.props.dispatch(actionCreators.addElementProperty({
      name: '',
      value: ''
    }));
  };

  setName = (id, name) => {
    this.props.dispatch(actionCreators.editElementProperty({
      id,
      name
    }));
  };

  setValue = (id, value) => {
    this.props.dispatch(actionCreators.editElementProperty({
      id,
      value
    }));
  };

  setValueIsRegex = (id, valueIsRegex) => {
    this.props.dispatch(actionCreators.editElementProperty({
      id,
      valueIsRegex
    }));
  };

  remove = id => {
    this.props.dispatch(actionCreators.removeElementProperty(id));
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
        <Coral.Button ref="addButton" onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ElementPropertiesEditor)
