import { createAction, handleActions } from 'redux-actions';

const SET_ELEMENT_SELECTOR = 'dataElementDelegates/dom/SET_ELEMENT_SELECTOR';
const SET_SELECTED_ELEMENT_PROPERTY_PRESET = 'dataElementDelegates/dom/SET_SELECTED_ELEMENT_PROPERTY_PRESET';
const SET_CUSTOM_ELEMENT_PROPERTY = 'dataElementDelegates/dom/SET_CUSTOM_ELEMENT_PROPERTY';

export let actionCreators = {
  setElementSelector: createAction(SET_ELEMENT_SELECTOR),
  setSelectedElementPropertyPreset: createAction(SET_SELECTED_ELEMENT_PROPERTY_PRESET),
  setCustomElementProperty: createAction(SET_CUSTOM_ELEMENT_PROPERTY)
};

export default handleActions({
  [SET_ELEMENT_SELECTOR]: (state, action) => {
    return state.set('elementSelector', action.payload);
  },
  [SET_SELECTED_ELEMENT_PROPERTY_PRESET]: (state, action) => {
    return state.set('selectedElementPropertyPreset', action.payload);
  },
  [SET_CUSTOM_ELEMENT_PROPERTY]: (state, action) => {
    return state.set('customElementProperty', action.payload);
  }
});
