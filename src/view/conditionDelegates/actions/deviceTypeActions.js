import { createAction, handleActions } from 'redux-actions';

const SET_DEVICE_TYPES = 'conditionDelegates/deviceType/SET_DEVICE_TYPES';

export let actionCreators = {
  setDeviceTypes: createAction(SET_DEVICE_TYPES)
};

export default handleActions({
  [SET_DEVICE_TYPES]: (state, action) => {
    return state.set('deviceTypes', action.payload);
  }
});
