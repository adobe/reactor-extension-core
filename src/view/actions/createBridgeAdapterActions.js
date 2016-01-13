import { createAction, handleActions } from 'redux-actions';

const SET_CONFIG = 'bridgeAdapter/SET_CONFIG';

export let actionCreators = {
  setConfig: createAction(SET_CONFIG)
};

export default getBridgeAdapterReducers => {
  return handleActions({
    [SET_CONFIG]: (state, action) => {
      const bridgeAdapterReducers = getBridgeAdapterReducers();
      const initialValues = bridgeAdapterReducers.configToFormValues({}, action.payload);

      // redux-form will use initialValues to update the form.
      state = {
        ...state,
        initialValues,
        propertyConfig: action.payload.propertyConfig
      };

      // Clear any previously held form values.
      delete state.form.default;
      return state;
    }
  });
}
