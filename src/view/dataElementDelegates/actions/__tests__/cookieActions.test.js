import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../cookieActions';

describe('cookie actions', () => {
  it('sets cookie name', () => {
    testPassThroughAction(reducer, actionCreators.setName, 'name');
  });
});
