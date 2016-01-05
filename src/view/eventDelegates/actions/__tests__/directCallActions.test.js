import testStringAction from '../../../__tests__/helpers/testStringAction';
import reducer, { actionCreators } from '../directCallActions';

describe('direct call actions', () => {
  it('sets name', () => {
    testStringAction(reducer, actionCreators.setName, 'name');
  });
});
