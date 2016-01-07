import { createAction, handleActions } from 'redux-actions';

const SELECT_DEVICE_TYPE = 'conditionDelegates/deviceType/SELECT_DEVICE_TYPE';
const DESELECT_DEVICE_TYPE = 'conditionDelegates/deviceType/DESELECT_DEVICE_TYPE';

export let actionCreators = {
  selectDeviceType: createAction(SELECT_DEVICE_TYPE),
  deselectDeviceType: createAction(DESELECT_DEVICE_TYPE)
};

export default handleActions({
  [SELECT_DEVICE_TYPE]: (state, action) => {
    return state.update('deviceTypes', deviceTypes => {
      return deviceTypes.indexOf(action.payload) === -1 ?
        deviceTypes.push(action.payload) :
        deviceTypes;
    });
  },
  [DESELECT_DEVICE_TYPE]: (state, action) => {
    return state.update('deviceTypes', deviceTypes => {
      let index = deviceTypes.indexOf(action.payload);
      return index !== -1 ?
        deviceTypes.splice(index, 1) :
        deviceTypes;
    });
  }
});
