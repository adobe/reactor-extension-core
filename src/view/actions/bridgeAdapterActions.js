import Actions from '../constants/actions';
import { createAction } from 'redux-actions';

export let setConfig = createAction(Actions.SET_CONFIG);
export let validate = createAction(Actions.VALIDATE);
