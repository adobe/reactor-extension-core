import reduceReducers from 'reduce-reducers';
import { reducer as formReducer } from 'redux-form';

import createBridgeAdapterActions from './createBridgeAdapterActions';

export default getBridgeAdapterReducers => {
  return reduceReducers(
    createBridgeAdapterActions(getBridgeAdapterReducers),

    // Setup for redux-form.
    (state, action) => {
      return {
        ...state,
        form: formReducer(state.form, action)
      };
    }
  );
}
