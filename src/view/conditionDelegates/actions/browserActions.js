import { createAction, handleActions } from 'redux-actions';

const SELECT_BROWSER = 'conditionDelegates/browser/SELECT_BROWSER';
const DESELECT_BROWSER = 'conditionDelegates/browser/DESELECT_BROWSER';

export let actionCreators = {
  selectBrowser: createAction(SELECT_BROWSER),
  deselectBrowser: createAction(DESELECT_BROWSER)
};

export default handleActions({
  [SELECT_BROWSER]: (state, action) => {
    return state.update('browsers', browsers => {
      return browsers.indexOf(action.payload) === -1 ?
        browsers.push(action.payload) :
        browsers;
    });
  },
  [DESELECT_BROWSER]: (state, action) => {
    return state.update('browsers', browsers => {
      let index = browsers.indexOf(action.payload);
      return index !== -1 ?
        browsers.splice(index, 1) :
        browsers;
    });
  }
});
