import testListAction from '../../../__tests__/helpers/testListAction';
import reducer, { actionCreators } from '../browserActions';
import { Map, List } from 'immutable';

describe('browser actions', () => {
  it('selects a browser', () => {
    let state = Map({
      browsers: List()
    });
    state = reducer(state, actionCreators.selectBrowser('foo'));
    expect(state.get('browsers').toJS()).toEqual(['foo']);
  });

  it('deselects a browser', () => {
    let state = Map({
      browsers: List(['foo', 'bar'])
    });
    state = reducer(state, actionCreators.deselectBrowser('bar'));
    expect(state.get('browsers').toJS()).toEqual(['foo']);
  });
});
