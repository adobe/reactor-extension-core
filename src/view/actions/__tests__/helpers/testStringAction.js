import { Map } from 'immutable';

/**
 * Tests that an action properly sets a string value.
 * @param reducer
 * @param actionCreator
 * @param propertyName
 */
export default (reducer, actionCreator, propertyName) => {
  let state = Map();
  state = reducer(state, actionCreator('foo'));
  expect(state.get(propertyName)).toBe('foo');
};
