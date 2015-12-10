import { createAction, handleActions } from 'redux-actions';

const SET_BUBBLE_FIRE_IF_PARENT = 'SET_BUBBLE_FIRE_IF_PARENT';
const SET_BUBBLE_FIRE_IF_CHILD_FIRED = 'SET_BUBBLE_FIRE_IF_CHILD_FIRED';
const SET_BUBBLE_STOP = 'SET_BUBBLE_STOP';

export let setBubbleFireIfParent = createAction(SET_BUBBLE_FIRE_IF_PARENT);
export let setBubbleFireIfChildFired = createAction(SET_BUBBLE_FIRE_IF_CHILD_FIRED);
export let setBubbleStop = createAction(SET_BUBBLE_STOP);

export default handleActions({
  [SET_BUBBLE_FIRE_IF_PARENT]: (state, action) => {
    return state.set('bubbleFireIfParent', action.payload);
  },
  [SET_BUBBLE_FIRE_IF_CHILD_FIRED]: (state, action) => {
    return state.set('bubbleFireIfChildFired', action.payload);
  },
  [SET_BUBBLE_STOP]: (state, action) => {
    return state.set('bubbleStop', action.payload);
  }
});
