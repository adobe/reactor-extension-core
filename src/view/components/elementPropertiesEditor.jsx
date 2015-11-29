import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import {stateStream} from '../store';
import {setConfigParts} from '../actions';
import createID from '../utils/createID';
import {List, Map} from 'immutable'

export default React.createClass({
  itemIdIncrementor: 0,

  getInitialState: function() {
    return {
      elementProperties: List()
    };
  },

  componentDidMount: function() {
    this.unsub = stateStream
      .filterByChanges('config.elementProperties')
      .map(function(state) {
        return {
          elementProperties: state.get('config').get('elementProperties')
        };
      })
      .assign(this, 'setState');
  },

  componentWillUnmount: function() {
    this.unsub();
  },

  save: function(elementProperties) {
    setConfigParts.push({
      elementProperties
    });
  },

  add: function() {
    let elementProperties = this.state.elementProperties.push(Map({
      id: createID(),
      name: '',
      value: ''
    }));
    this.save(elementProperties);
  },

  setName: function(index, name) {
    let elementProperties = this.state.elementProperties.update(index, function(elementProperty) {
      return elementProperty.set('name', name);
    });
    this.save(elementProperties);
  },

  setValue: function(index, value) {
    let elementProperties = this.state.elementProperties.update(index, function(elementProperty) {
      return elementProperty.set('value', value);
    });
    this.save(elementProperties);
  },

  remove: function(index) {
    let elementProperties = this.state.elementProperties.delete(index);
    this.save(elementProperties);
  },

  render: function() {
    return (
      <div>
        <span className="u-italic">and having the following property values</span>
        {this.state.elementProperties.map((property, index) => {
          return <ElementPropertyEditor
            key={property.get('id')}
            name={property.get('name')}
            value={property.get('value')}
            setName={this.setName.bind(null, index)}
            setValue={this.setValue.bind(null, index)}
            remove={this.remove.bind(null, index)}
            removable={this.state.elementProperties.size > 1}
            />
        })}
        <Coral.Button onClick={this.add}>Add</Coral.Button>
      </div>
    );
  }
});
