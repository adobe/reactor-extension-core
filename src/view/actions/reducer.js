import reduceReducers from 'reduce-reducers';
import { reducer as formReducer } from 'redux-form';
import bridgeAdapterActions from './bridgeAdapterActions';

export default reduceReducers(
  bridgeAdapterActions,

  // Setup for redux-form.
  (state, action) => {
    return {
      ...state,
      form: formReducer(state.form, action)
    };
  }
);
