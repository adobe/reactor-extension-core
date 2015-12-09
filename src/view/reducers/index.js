import { handleActions } from 'redux-actions';
import Actions from '../constants/actions';
import createID from '../utils/createID';
import clickReducerSet from '../bridgeReducerSets/clickReducerSet';
import { Map } from 'immutable';

let getElementPropertyIndex = (elementProperties, elementProperty) => {
  return elementProperties.findIndex(item => item.get('id') === elementProperty.get('id'));
};

let replaceElementProperty = (state, elementProperty) => {
  return state.update('elementProperties', elementProperties => {
    let index = getElementPropertyIndex(elementProperties, elementProperty);

    if (index !== -1) {
      elementProperties = elementProperties.set(index, elementProperty);
    }

    return elementProperties;
  });
};

export default handleActions({
  [Actions.SET_CONFIG]: (state, action) => {
    return clickReducerSet.configToState(state, action);
  },
  [Actions.VALIDATE]: (state, action) => {
    return clickReducerSet.validate(state, action);
  },
  [Actions.SET_SHOW_SPECIFIC_ELEMENTS_FILTER]: (state, action) => {
    return state.set('showSpecificElementsFilter', action.payload);
  },
  [Actions.SET_SHOW_ELEMENT_PROPERTIES_FILTER]: (state, action) => {
    return state.set('showElementPropertiesFilter', action.payload);
  },
  [Actions.SET_ELEMENT_SELECTOR]: (state, action) => {
    return state.set('elementSelector', action.payload);
  },
  [Actions.ADD_ELEMENT_PROPERTY]: (state, action) => {
    return state.update('elementProperties', elementProperties => {
      return elementProperties.push(Map({
        id: action.payload.id || createID(),
        name: action.payload.name,
        value: action.payload.value
      }));
    });
  },
  [Actions.REMOVE_ELEMENT_PROPERTY]: (state, action) => {
    return state.update('elementProperties', elementProperties => {
      let index = getElementPropertyIndex(elementProperties, action.payload);

      if (index !== -1) {
        elementProperties = elementProperties.delete(index);
      }

      return elementProperties;
    });
  },
  [Actions.EDIT_ELEMENT_PROPERTY]: (state, action) => {
    let elementProperty = action.payload.elementProperty.merge(action.payload.props);
    return replaceElementProperty(state, elementProperty);
  },
  [Actions.SET_DELAY_LINK_ACTIVATION]: (state, action) => {
    return state.set('delayLinkActivation', action.payload);
  },
  [Actions.SET_BUBBLE_FIRE_IF_PARENT]: (state, action) => {
    return state.set('bubbleFireIfParent', action.payload);
  },
  [Actions.SET_BUBBLE_FIRE_IF_CHILD_FIRED]: (state, action) => {
    return state.set('bubbleFireIfChildFired', action.payload);
  },
  [Actions.SET_BUBBLE_STOP]: (state, action) => {
    return state.set('bubbleStop', action.payload);
  }
});
