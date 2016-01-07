import { createAction, handleActions } from 'redux-actions';

const SELECT_DOMAIN = 'conditionDelegates/domain/SELECT_DOMAIN';
const DESELECT_DOMAIN = 'conditionDelegates/domain/DESELECT_DOMAIN';

export let actionCreators = {
  selectDomain: createAction(SELECT_DOMAIN),
  deselectDomain: createAction(DESELECT_DOMAIN)
};

export default handleActions({
  [SELECT_DOMAIN]: (state, action) => {
    return state.update('selectedDomains', selectedDomains => {
      return selectedDomains.indexOf(action.payload) === -1 ?
        selectedDomains.push(action.payload) :
        selectedDomains;
    });
  },
  [DESELECT_DOMAIN]: (state, action) => {
    return state.update('selectedDomains', selectedDomains => {
      let index = selectedDomains.indexOf(action.payload);
      return index !== -1 ?
        selectedDomains.splice(index, 1) :
        selectedDomains;
    });
  }
});
