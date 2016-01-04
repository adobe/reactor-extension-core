import testListAction from '../../../__tests__/helpers/testListAction';
import reducer, { actionCreators } from '../browserActions';
import { Map, List } from 'immutable';

describe('browser actions', () => {
  it('sets browsers', () => {
    testListAction(reducer, actionCreators.setBrowsers, 'browsers');
  });
});
