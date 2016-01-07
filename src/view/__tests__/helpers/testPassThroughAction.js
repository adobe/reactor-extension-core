import { Map } from 'immutable';

/**
 * Tests that an action properly passes through a value to the state without modification.
 * @param reducer
 * @param actionCreator
 * @param propertyName
 */
export default (reducer, actionCreator, propertyName) => {
  let state = Map();
  state = reducer(state, actionCreator('foo'));
  expect(state.get(propertyName)).toBe('foo');
  state = reducer(state, actionCreator(123));
  expect(state.get(propertyName)).toBe(123);
  state = reducer(state, actionCreator(false));
  expect(state.get(propertyName)).toBe(false);
};
