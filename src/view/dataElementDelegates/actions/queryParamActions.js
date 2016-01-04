import { createAction, handleActions } from 'redux-actions';

const SET_NAME = 'dataElementDelegates/queryParam/SET_NAME';
const SET_CASE_INSENSITIVE = 'dataElementDelegates/queryParam/SET_CASE_INSENSITIVE';

export let actionCreators = {
  setName: createAction(SET_NAME),
  setCaseInsensitive: createAction(SET_CASE_INSENSITIVE)
};

export default handleActions({
  [SET_NAME]: (state, action) => {
    return state.set('name', action.payload);
  },
  [SET_CASE_INSENSITIVE]: (state, action) => {
    return state.set('caseInsensitive', action.payload);
  }
});
