import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import {config} from '../store/config';

export default React.createClass({
  itemIdIncrementor: 0,
  getInitialState: function() {
    return {
      expanded: config.hasOwnProperty('elementProperties')
    }
  },
  componentWillMount: function() {
    var items = [];

    for (var property in config.elementProperties) {
      items.push({
        id: this.itemIdIncrementor++,
        property: property,
        value: config.elementProperties[property]
      })
    }

    this.items = items;

    // Always keep one row showing.
    if (!this.items.length) {
      this.add();
    }
  },
  saveItems: function(items) {
    var propertyValueMap = {};
    items.forEach(function(item) {
      if (item.hasOwnProperty('property') && item.property.trim().length) {
        propertyValueMap[item.property] = item.value;
      }
    });

    if (Object.keys(propertyValueMap).length) {
      config.elementProperties = propertyValueMap;
    } else {
      delete config.elementProperties;
    }

    this.forceUpdate();
  },
  add: function() {
    this.items.push({
      id: this.itemIdIncrementor++,
      property: '',
      value: ''
    });
    this.saveItems(this.items);
  },
  setProperty: function(currentItem, property) {
    currentItem.property = property;
    this.saveItems(this.items);
  },
  setValue: function(currentItem, value) {
    currentItem.value = value;
    this.saveItems(this.items);
  },
  remove: function(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.saveItems(this.items);
  },
  toggleProperties: function(event) {
    this.saveItems(event.target.checked ? this.items : []);
    this.setState({
      expanded: event.target.checked
    });
  },
  render: function() {
    var propertiesEditor;

    if (this.state.expanded) {
      propertiesEditor = (
        <div>
          {this.items.map(function(item) {
            return <ElementPropertyEditor
              key={item.id}
              property={item.property}
              value={item.value}
              setProperty={this.setProperty.bind(null, item)}
              setValue={this.setValue.bind(null, item)}
              remove={this.remove.bind(null, item)}
              removable={this.items.length > 1}
              />
          }.bind(this))}
          <Coral.Button onClick={this.add}>Add</Coral.Button>
        </div>
      );
    }

    return (
      <div>
        <Coral.Checkbox
          checked={this.state.expanded ? true : null}
          coral-onChange={this.toggleProperties}>And with the following property values…</Coral.Checkbox>
        {propertiesEditor}
      </div>
    );
  }
});
