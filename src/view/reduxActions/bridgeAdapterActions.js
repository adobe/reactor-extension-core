import { createAction, handleActions } from 'redux-actions';

const POPULATE_META = 'bridgeAdapter/POPULATE_META';
const MARK_INIT_COMPLETE = 'bridgeAdapter/MARK_INIT_COMPLETE';

export const actionCreators = {
  populateMeta: createAction(POPULATE_META),
  markInitComplete: createAction(MARK_INIT_COMPLETE)
};

export default handleActions({
  [POPULATE_META]: (state, action) => ({
    ...state,
    meta: {
      ...action.payload
    }
  }),
  [MARK_INIT_COMPLETE]: state => ({
    ...state,
    initializedByBridge: true
  })
});
