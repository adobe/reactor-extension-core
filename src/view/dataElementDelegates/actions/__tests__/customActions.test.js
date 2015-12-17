import testStringAction from '../../../__tests__/helpers/testStringAction';
import reducer, { actionCreators } from '../customActions';

describe('custom actions', () => {
  it('sets script', () => {
    testStringAction(reducer, actionCreators.setScript, 'script');
  });
});
