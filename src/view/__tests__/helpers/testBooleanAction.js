import { Map } from 'immutable';

/**
 * Tests that an action properly sets a boolean value.
 * @param reducer
 * @param actionCreator
 * @param propertyName
 */
export default (reducer, actionCreator, propertyName) => {
  let state = Map();
  state = reducer(state, actionCreator(true));
  expect(state.get(propertyName)).toBe(true);
  state = reducer(state, actionCreator(false));
  expect(state.get(propertyName)).toBe(false);
};
