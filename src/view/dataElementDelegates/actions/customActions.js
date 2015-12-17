import { createAction, handleActions } from 'redux-actions';

const SET_SCRIPT = 'dataElementDelegates/custom/SET_SCRIPT';

export let actionCreators = {
  setScript: createAction(SET_SCRIPT)
};

export default handleActions({
  [SET_SCRIPT]: (state, action) => {
    return state.set('script', action.payload);
  }
});
