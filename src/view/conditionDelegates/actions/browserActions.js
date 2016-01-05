import { createAction, handleActions } from 'redux-actions';

const SET_BROWSERS = 'conditionDelegates/browser/SET_BROWSERS';

export let actionCreators = {
  setBrowsers: createAction(SET_BROWSERS)
};

export default handleActions({
  [SET_BROWSERS]: (state, action) => {
    return state.set('browsers', action.payload);
  }
});
