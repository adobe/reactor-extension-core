import testListAction from '../../../__tests__/helpers/testListAction';
import reducer, { actionCreators } from '../domainActions';
import { Map, List } from 'immutable';

describe('domain actions', () => {
  it('selects a domain', () => {
    let state = Map({
      selectedDomains: List()
    });
    state = reducer(state, actionCreators.selectDomain('foo'));
    expect(state.get('selectedDomains').toJS()).toEqual(['foo']);
  });

  it('deselects a domain', () => {
    let state = Map({
      selectedDomains: List(['foo', 'bar'])
    });
    state = reducer(state, actionCreators.deselectDomain('bar'));
    expect(state.get('selectedDomains').toJS()).toEqual(['foo']);
  });
});
