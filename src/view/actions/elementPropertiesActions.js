import Bacon from 'baconjs';
import {stateUpdate} from '../store';
import {Map} from 'immutable';
import createID from '../utils/createID';

let getIndex = (elementProperties, elementProperty) => {
  return elementProperties.findIndex(item => item.get('id') === elementProperty.get('id'));
};

let replaceElementProperty = (state, elementProperty) => {
  return state.updateIn(['config', 'elementProperties'], elementProperties => {
    let index = getIndex(elementProperties, elementProperty);

    if (index !== -1) {
      elementProperties = elementProperties.set(index, elementProperty);
    }

    return elementProperties;
  });
};

let add = new Bacon.Bus();
stateUpdate.plug(add.map(event => {
  return state => {
    return state.updateIn(['config', 'elementProperties'], elementProperties => {
      return elementProperties.push(Map({
        id: event.id || createID(),
        name: event.name,
        value: event.value
      }));
    });
  };
}));

let remove = new Bacon.Bus();
stateUpdate.plug(remove.map(elementProperty => {
  return state => {
    return state.updateIn(['config', 'elementProperties'], elementProperties => {
      let index = getIndex(elementProperties, elementProperty);

      if (index !== -1) {
        elementProperties = elementProperties.delete(index);
      }

      return elementProperties;
    });
  }
}));

let setName = new Bacon.Bus();
stateUpdate.plug(setName.map(event => {
  let elementProperty = event.elementProperty.set('name', event.name);
  return state => replaceElementProperty(state, elementProperty);
}));

let setValue = new Bacon.Bus();
stateUpdate.plug(setValue.map(event => {
  let elementProperty = event.elementProperty.set('value', event.value);
  return state => replaceElementProperty(state, elementProperty);
}));

export default {
  add,
  remove,
  setName,
  setValue
};
