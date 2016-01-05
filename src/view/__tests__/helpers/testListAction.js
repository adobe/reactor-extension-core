import { Map, List } from 'immutable';

/**
 * Tests that an action properly sets an ImmutableJS list value.
 * @param reducer
 * @param actionCreator
 * @param propertyName
 */
export default (reducer, actionCreator, propertyName) => {
  let state = Map();
  state = reducer(state, actionCreator(List(['foo'])));
  expect(state.get(propertyName).toJS()).toEqual(['foo']);
};
