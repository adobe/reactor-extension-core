import Actions from '../constants/actions';
import { createAction } from 'redux-actions';

export let setBubbleFireIfParent = createAction(Actions.SET_BUBBLE_FIRE_IF_PARENT);
export let setBubbleFireIfChildFired = createAction(Actions.SET_BUBBLE_FIRE_IF_CHILD_FIRED);
export let setBubbleStop = createAction(Actions.SET_BUBBLE_STOP);
