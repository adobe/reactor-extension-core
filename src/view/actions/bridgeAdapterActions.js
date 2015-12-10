import { createAction, handleActions } from 'redux-actions';
import clickReducerSet from '../bridgeReducerSets/clickReducerSet';

const SET_CONFIG = 'SET_CONFIG';
const VALIDATE = 'VALIDATE';

export let setConfig = createAction(SET_CONFIG);
export let validate = createAction(VALIDATE);

export default handleActions({
  [SET_CONFIG]: (state, action) => {
    return clickReducerSet.configToState(state, action);
  },
  [VALIDATE]: (state, action) => {
    return clickReducerSet.validate(state, action);
  }
});
