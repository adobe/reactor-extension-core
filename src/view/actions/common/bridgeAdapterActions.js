import { createAction, handleActions } from 'redux-actions';
import { bridgeAdapterReducer } from '../../bridgeAdapter';

const SET_CONFIG = 'bridgeAdapter/SET_CONFIG';
const VALIDATE = 'bridgeAdapter/VALIDATE';

export let actionCreators = {
  setConfig: createAction(SET_CONFIG),
  validate: createAction(VALIDATE)
};

export default handleActions({
  [SET_CONFIG]: (state, action) => {
    return bridgeAdapterReducer.configToState(state, action);
  },
  [VALIDATE]: (state, action) => {
    return bridgeAdapterReducer.validate(state, action);
  }
});
