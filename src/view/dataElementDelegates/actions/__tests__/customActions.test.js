import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../customActions';

describe('custom actions', () => {
  it('sets script', () => {
    testPassThroughAction(reducer, actionCreators.setScript, 'script');
  });
});
