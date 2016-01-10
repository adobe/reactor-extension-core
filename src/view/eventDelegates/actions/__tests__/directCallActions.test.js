import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../directCallActions';

describe('direct call actions', () => {
  it('sets name', () => {
    testPassThroughAction(reducer, actionCreators.setName, 'name');
  });
});
