import Rx from 'rx';
import store from '../store';
import { Map } from 'immutable';
import createID from '../utils/createID';

let getIndex = (elementProperties, elementProperty) => {
  return elementProperties.findIndex(item => item.get('id') === elementProperty.get('id'));
};

let replaceElementProperty = (state, elementProperty) => {
  return state.update('elementProperties', elementProperties => {
    let index = getIndex(elementProperties, elementProperty);

    if (index !== -1) {
      elementProperties = elementProperties.set(index, elementProperty);
    }

    return elementProperties;
  });
};

let add = new Rx.Subject();
add.map(event => {
  return state => {
    return state.update('elementProperties', elementProperties => {
      return elementProperties.push(Map({
        id: event.id || createID(),
        name: event.name,
        value: event.value
      }));
    });
  };
}).subscribe(store);

let remove = new Rx.Subject();
remove.map(elementProperty => {
  return state => {
    return state.update('elementProperties', elementProperties => {
      let index = getIndex(elementProperties, elementProperty);

      if (index !== -1) {
        elementProperties = elementProperties.delete(index);
      }

      return elementProperties;
    });
  }
}).subscribe(store);

let edit = new Rx.Subject();
edit.map(event => {
  let elementProperty = event.elementProperty.merge(event.props);
  return state => replaceElementProperty(state, elementProperty);
}).subscribe(store);

export default {
  add,
  remove,
  edit
};
