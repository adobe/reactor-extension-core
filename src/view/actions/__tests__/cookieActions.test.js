import testStringAction from './helpers/testStringAction';
import reducer, { actionCreators } from '../cookieActions';

describe('cookie actions', () => {
  it('sets cookie name', () => {
    testStringAction(reducer, actionCreators.setName, 'name');
  });
});
