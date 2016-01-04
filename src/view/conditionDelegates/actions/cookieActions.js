import { createAction, handleActions } from 'redux-actions';

const SET_NAME = 'conditionDelegates/cookie/SET_NAME';
const SET_VALUE = 'conditionDelegates/cookie/SET_VALUE';
const SET_VALUE_IS_REGEX = 'conditionDelegates/cookie/SET_VALUE_IS_REGEX';

export let actionCreators = {
  setName: createAction(SET_NAME),
  setValue: createAction(SET_VALUE),
  setValueIsRegex: createAction(SET_VALUE_IS_REGEX)
};

export default handleActions({
  [SET_NAME]: (state, action) => {
    return state.set('name', action.payload);
  },
  [SET_VALUE]: (state, action) => {
    return state.set('value', action.payload);
  },
  [SET_VALUE_IS_REGEX]: (state, action) => {
    return state.set('valueIsRegex', action.payload);
  }
});
