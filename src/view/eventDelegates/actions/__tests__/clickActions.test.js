import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../clickActions';

describe('click actions', () => {
  it('sets delayLinkActivation', () => {
    testPassThroughAction(reducer, actionCreators.setDelayLinkActivation, 'delayLinkActivation');
  });
});
