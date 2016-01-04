import { createAction, handleActions } from 'redux-actions';

const SET_ACCEPTS_COOKIES = 'conditionDelegates/cookieOptOut/SET_ACCEPTS_COOKIES';

export let actionCreators = {
  setAcceptsCookies: createAction(SET_ACCEPTS_COOKIES)
};

export default handleActions({
  [SET_ACCEPTS_COOKIES]: (state, action) => {
    return state.set('acceptsCookies', action.payload);
  }
});
