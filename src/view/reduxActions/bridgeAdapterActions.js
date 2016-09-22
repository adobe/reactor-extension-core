import { createAction, handleActions } from 'redux-actions';

const RESET = 'bridgeAdapter/RESET';
const POPULATE_META = 'bridgeAdapter/POPULATE_META';
const INIT = 'bridgeAdapter/INIT';

export const actionCreators = {
  reset: createAction(RESET),
  populateMeta: createAction(POPULATE_META),
  init: createAction(INIT)
};

export default handleActions({
  [RESET]: () => ({}),
  [POPULATE_META]: (state, action) => ({
    ...state,
    ...action.payload
  }),
  [INIT]: (state, action) => {
    const { payload } = action;

    return {
      ...state,
      ...payload
    };
  }
});
