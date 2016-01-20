import { createAction, handleActions } from 'redux-actions';

const INIT = 'bridgeAdapter/INIT';

export const actionCreators = {
  init: createAction(INIT)
};

export default handleActions({
  [INIT]: (state, action) => {
    const { payload } = action;

    return {
      ...state,
      ...payload
    };
  }
});
