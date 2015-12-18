import { createAction, handleActions } from 'redux-actions';

const SET_PATH = 'dataElementDelegates/variable/SET_PATH';

export let actionCreators = {
  setPath: createAction(SET_PATH)
};

export default handleActions({
  [SET_PATH]: (state, action) => {
    return state.set('path', action.payload);
  }
});
