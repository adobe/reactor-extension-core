import React from 'react';
import Coral from 'coralui-support-react';
import ElementPropertyEditor from '../components/elementPropertyEditor';
import store from '../store';
import ConfigComponentMixin from '../mixins/configComponentMixin';

export default React.createClass({
  itemIdIncrementor: 0,
  mixins: [ConfigComponentMixin],

  onStoreUpdate: function() {
    this.buildItemsList();
  },

  buildItemsList: function() {
    var updatedElementProperties = this.config.elementProperties;
    var items = [];

    for (var property in updatedElementProperties) {
      items.push({
        id: this.itemIdIncrementor++,
        property: property,
        value: updatedElementProperties[property]
      })
    }

    this.items = items;

    // Always keep one row showing.
    this.add();
  },

  saveItems: function(items) {
    var propertyValueMap = {};
    items.forEach(function(item) {
      if (item.hasOwnProperty('property') && item.property.trim().length) {
        propertyValueMap[item.property] = item.value;
      }
    });

    if (Object.keys(propertyValueMap).length) {
      this.config.elementProperties = propertyValueMap;
    } else {
      delete this.config.elementProperties;
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

  render: function() {
    return (
      <div>
        <span className="u-italic">and having the following property values:</span>
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
});
