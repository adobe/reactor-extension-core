import { createAction, handleActions } from 'redux-actions';
import createID from '../utils/createID';
import { Map } from 'immutable';

const SET_SHOW_SPECIFIC_ELEMENTS_FILTER = 'SET_SHOW_SPECIFIC_ELEMENTS_FILTER';
const SET_SHOW_ELEMENT_PROPERTIES_FILTER = 'SET_SHOW_ELEMENT_PROPERTIES_FILTER';
const SET_ELEMENT_SELECTOR = 'SET_ELEMENT_SELECTOR';
const ADD_ELEMENT_PROPERTY = 'ADD_ELEMENT_PROPERTY';
const REMOVE_ELEMENT_PROPERTY = 'REMOVE_ELEMENT_PROPERTY';
const EDIT_ELEMENT_PROPERTY = 'EDIT_ELEMENT_PROPERTY';

export let setShowSpecificElementsFilter = createAction(SET_SHOW_SPECIFIC_ELEMENTS_FILTER);
export let setShowElementPropertiesFilter = createAction(SET_SHOW_ELEMENT_PROPERTIES_FILTER);
export let setElementSelector = createAction(SET_ELEMENT_SELECTOR);
export let addElementProperty = createAction(ADD_ELEMENT_PROPERTY);
export let removeElementProperty = createAction(REMOVE_ELEMENT_PROPERTY);
export let editElementProperty = createAction(EDIT_ELEMENT_PROPERTY);

export default handleActions({
  [SET_SHOW_SPECIFIC_ELEMENTS_FILTER]: (state, action) => {
    return state.set('showSpecificElementsFilter', action.payload);
  },
  [SET_SHOW_ELEMENT_PROPERTIES_FILTER]: (state, action) => {
    return state.set('showElementPropertiesFilter', action.payload);
  },
  [SET_ELEMENT_SELECTOR]: (state, action) => {
    return state.set('elementSelector', action.payload);
  },
  [ADD_ELEMENT_PROPERTY]: (state, action) => {
    let id = action.payload.id || createID();
    return state.setIn(['elementProperties', id], Map({
      id,
      name: action.payload.name,
      value: action.payload.value
    }));
  },
  [REMOVE_ELEMENT_PROPERTY]: (state, action) => {
    return state.deleteIn(['elementProperties', action.payload]);
  },
  [EDIT_ELEMENT_PROPERTY]: (state, action) => {
    return state.updateIn(['elementProperties', action.payload.id], elementProperty => {
      return elementProperty.merge(action.payload);
    });
  }
});
