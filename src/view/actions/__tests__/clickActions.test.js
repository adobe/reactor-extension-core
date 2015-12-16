import testBooleanAction from './helpers/testBooleanAction';
import reducer, { actionCreators } from '../clickActions';

describe('click actions', () => {
  it('sets delayLinkActivation', () => {
    testBooleanAction(reducer, actionCreators.setDelayLinkActivation, 'delayLinkActivation');
  });
});
