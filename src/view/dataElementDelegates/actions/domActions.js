import { createAction, handleActions } from 'redux-actions';

const SET_ELEMENT_SELECTOR = 'dataElementDelegates/dom/SET_ELEMENT_SELECTOR';
const SET_ELEMENT_PROPERTY = 'dataElementDelegates/dom/SET_ELEMENT_PROPERTY';

export let actionCreators = {
  setElementSelector: createAction(SET_ELEMENT_SELECTOR),
  setElementProperty: createAction(SET_ELEMENT_PROPERTY)
};

export default handleActions({
  [SET_ELEMENT_SELECTOR]: (state, action) => {
    return state.set('elementSelector', action.payload);
  },
  [SET_ELEMENT_PROPERTY]: (state, action) => {
    return state.set('elementProperty', action.payload);
  }
});
