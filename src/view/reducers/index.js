import { handleActions } from 'redux-actions';
import Actions from '../constants/actions';
import createID from '../utils/createID';
import clickReducerSet from '../bridgeReducerSets/clickReducerSet';
import { Map } from 'immutable';

export default handleActions({
  [Actions.SET_CONFIG]: (state, action) => {
    return clickReducerSet.configToState(state, action);
  },
  [Actions.VALIDATE]: (state, action) => {
    return clickReducerSet.validate(state, action);
  },
  [Actions.SET_SHOW_SPECIFIC_ELEMENTS_FILTER]: (state, action) => {
    return state.set('showSpecificElementsFilter', action.payload);
  },
  [Actions.SET_SHOW_ELEMENT_PROPERTIES_FILTER]: (state, action) => {
    return state.set('showElementPropertiesFilter', action.payload);
  },
  [Actions.SET_ELEMENT_SELECTOR]: (state, action) => {
    return state.set('elementSelector', action.payload);
  },
  [Actions.ADD_ELEMENT_PROPERTY]: (state, action) => {
    let id = action.payload.id || createID();
    return state.setIn(['elementProperties', id], Map({
      id,
      name: action.payload.name,
      value: action.payload.value
    }));
  },
  [Actions.REMOVE_ELEMENT_PROPERTY]: (state, action) => {
    return state.deleteIn(['elementProperties', action.payload]);
  },
  [Actions.EDIT_ELEMENT_PROPERTY]: (state, action) => {
    return state.updateIn(['elementProperties', action.payload.id], elementProperty => {
      return elementProperty.merge(action.payload);
    });
  },
  [Actions.SET_DELAY_LINK_ACTIVATION]: (state, action) => {
    return state.set('delayLinkActivation', action.payload);
  },
  [Actions.SET_BUBBLE_FIRE_IF_PARENT]: (state, action) => {
    return state.set('bubbleFireIfParent', action.payload);
  },
  [Actions.SET_BUBBLE_FIRE_IF_CHILD_FIRED]: (state, action) => {
    return state.set('bubbleFireIfChildFired', action.payload);
  },
  [Actions.SET_BUBBLE_STOP]: (state, action) => {
    return state.set('bubbleStop', action.payload);
  }
});
