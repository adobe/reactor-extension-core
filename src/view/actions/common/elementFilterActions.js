import { createAction, handleActions } from 'redux-actions';
import createID from '../../utils/createID';
import { Map } from 'immutable';

const SET_SHOW_SPECIFIC_ELEMENTS_FILTER = 'elementFilter/SET_SHOW_SPECIFIC_ELEMENTS_FILTER';
const SET_SHOW_ELEMENT_PROPERTIES_FILTER = 'elementFilter/SET_SHOW_ELEMENT_PROPERTIES_FILTER';
const SET_ELEMENT_SELECTOR = 'elementFilter/SET_ELEMENT_SELECTOR';
const ADD_ELEMENT_PROPERTY = 'elementFilter/ADD_ELEMENT_PROPERTY';
const REMOVE_ELEMENT_PROPERTY = 'elementFilter/REMOVE_ELEMENT_PROPERTY';
const EDIT_ELEMENT_PROPERTY = 'elementFilter/EDIT_ELEMENT_PROPERTY';

export let actionCreators = {
  setShowSpecificElementsFilter: createAction(SET_SHOW_SPECIFIC_ELEMENTS_FILTER),
  setShowElementPropertiesFilter: createAction(SET_SHOW_ELEMENT_PROPERTIES_FILTER),
  setElementSelector: createAction(SET_ELEMENT_SELECTOR),
  addElementProperty: createAction(ADD_ELEMENT_PROPERTY),
  removeElementProperty: createAction(REMOVE_ELEMENT_PROPERTY),
  editElementProperty: createAction(EDIT_ELEMENT_PROPERTY)
};

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
