import { createAction, handleActions } from 'redux-actions';

const SET_DELAY_LINK_ACTIVATION = 'SET_DELAY_LINK_ACTIVATION';

export let setDelayLinkActivation = createAction(SET_DELAY_LINK_ACTIVATION);

export default handleActions({
  [SET_DELAY_LINK_ACTIVATION]: (state, action) => {
    return state.set('delayLinkActivation', action.payload);
  }
});
