import testBooleanAction from './helpers/testBooleanAction';
import reducer, { actionCreators } from '../delayLinkActivationActions';

describe('delay link activation actions', () => {
  it('sets delayLinkActivation', () => {
    testBooleanAction(reducer, actionCreators.setDelayLinkActivation, 'delayLinkActivation');
  });
});
