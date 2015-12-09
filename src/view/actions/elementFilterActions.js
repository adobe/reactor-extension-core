import Actions from '../constants/actions';
import { createAction } from 'redux-actions';

export let setShowSpecificElementsFilter = createAction(Actions.SET_SHOW_SPECIFIC_ELEMENTS_FILTER);
export let setShowElementPropertiesFilter = createAction(Actions.SET_SHOW_ELEMENT_PROPERTIES_FILTER);

export let setElementSelector = createAction(Actions.SET_ELEMENT_SELECTOR);

export let addElementProperty = createAction(Actions.ADD_ELEMENT_PROPERTY);
export let removeElementProperty = createAction(Actions.REMOVE_ELEMENT_PROPERTY);
export let editElementProperty = createAction(Actions.EDIT_ELEMENT_PROPERTY);

