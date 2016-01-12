import { createAction, handleActions } from 'redux-actions';
import { bridgeAdapterReducers } from '../bridgeAdapter';

const SET_CONFIG = 'bridgeAdapter/SET_CONFIG';

export let actionCreators = {
  setConfig: createAction(SET_CONFIG)
};

export default handleActions({
  [SET_CONFIG]: (state, action) => {
    const initialValues = bridgeAdapterReducers.configToState({}, action.payload);

    // redux-form will use initialValues to update the form.
    state = {
      ...state,
      initialValues
    };

    // Clear any previously held form values.
    delete state.form.default;
    return state;
  }
});
