import { createAction, handleActions } from 'redux-actions';

const SET_BUBBLE_FIRE_IF_PARENT = 'bubble/SET_BUBBLE_FIRE_IF_PARENT';
const SET_BUBBLE_FIRE_IF_CHILD_FIRED = 'bubble/SET_BUBBLE_FIRE_IF_CHILD_FIRED';
const SET_BUBBLE_STOP = 'bubble/SET_BUBBLE_STOP';

export let actionCreators = {
  setBubbleFireIfParent: createAction(SET_BUBBLE_FIRE_IF_PARENT),
  setBubbleFireIfChildFired: createAction(SET_BUBBLE_FIRE_IF_CHILD_FIRED),
  setBubbleStop: createAction(SET_BUBBLE_STOP)
};

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
