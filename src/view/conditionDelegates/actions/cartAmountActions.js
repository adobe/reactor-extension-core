import { createAction, handleActions } from 'redux-actions';

const SET_DATA_ELEMENT_NAME = 'conditionDelegates/cartAmount/SET_DATA_ELEMENT_NAME';
const SET_OPERATOR = 'conditionDelegates/cartAmount/SET_OPERATOR';
const SET_AMOUNT = 'conditionDelegates/cartAmount/SET_AMOUNT';

export let actionCreators = {
  setDataElementName: createAction(SET_DATA_ELEMENT_NAME),
  setOperator: createAction(SET_OPERATOR),
  setAmount: createAction(SET_AMOUNT)
};

export default handleActions({
  [SET_DATA_ELEMENT_NAME]: (state, action) => {
    return state.set('dataElementName', action.payload);
  },
  [SET_OPERATOR]: (state, action) => {
    return state.set('operator', action.payload);
  },
  [SET_AMOUNT]: (state, action) => {
    return state.set('amount', action.payload);
  }
});
