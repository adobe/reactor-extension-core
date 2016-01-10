import testPassThroughAction from '../../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../bubbleActions';

describe('bubble actions', () => {
  it('sets bubbleFireIfParent', () => {
    testPassThroughAction(reducer, actionCreators.setBubbleFireIfParent, 'bubbleFireIfParent');
  });

  it('sets bubbleFireIfChildFired', () => {
    testPassThroughAction(reducer, actionCreators.setBubbleFireIfChildFired, 'bubbleFireIfChildFired');
  });

  it('sets bubbleStop', () => {
    testPassThroughAction(reducer, actionCreators.setBubbleStop, 'bubbleStop');
  });
});
