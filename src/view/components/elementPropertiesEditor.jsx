import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import store from '../store';
import { List } from 'immutable';
import actions from '../actions/elementPropertiesActions';

export default React.createClass({
  itemIdIncrementor: 0,

  getInitialState: function() {
    return {
      elementProperties: List()
    };
  },

  componentDidMount: function() {
    this.disposable = store
      .map(function(state) {
        return {
          elementProperties: state.get('elementProperties')
        };
      })
      .subscribe(state => this.setState(state));
  },

  componentWillUnmount: function() {
    this.disposable.dispose();
  },

  add: function() {
    actions.add.onNext({
      name: '',
      value: ''
    });
  },

  setName: function(elementProperty, name) {
    actions.edit.onNext({
      elementProperty,
      props: {
        name
      }
    });
  },

  setValue: function(elementProperty, value) {
    actions.edit.onNext({
      elementProperty,
      props: {
        value
      }
    });
  },

  setValueIsRegex: function(elementProperty, valueIsRegex) {
    actions.edit.onNext({
      elementProperty,
      props: {
        valueIsRegex
      }
    });
  },

  remove: function(elementProperty) {
    actions.remove.onNext(elementProperty);
  },
  
  render: function() {
    return (
      <div>
        {this.state.elementProperties.map(property => {
          return <ElementPropertyEditor
            key={property.get('id')}
            name={property.get('name')}
            value={property.get('value')}
            valueIsRegex={property.get('valueIsRegex')}
            setName={this.setName.bind(null, property)}
            setValue={this.setValue.bind(null, property)}
            setValueIsRegex={this.setValueIsRegex.bind(null, property)}
            remove={this.remove.bind(null, property)}
            removable={this.state.elementProperties.size > 1}
            />
        })}
        <Coral.Button onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
});
