import testBooleanAction from './helpers/testBooleanAction';
import reducer, { actionCreators } from '../bubbleActions';

describe('bubble actions', () => {
  it('sets bubbleFireIfParent', () => {
    testBooleanAction(reducer, actionCreators.setBubbleFireIfParent, 'bubbleFireIfParent');
  });

  it('sets bubbleFireIfChildFired', () => {
    testBooleanAction(reducer, actionCreators.setBubbleFireIfChildFired, 'bubbleFireIfChildFired');
  });

  it('sets bubbleStop', () => {
    testBooleanAction(reducer, actionCreators.setBubbleStop, 'bubbleStop');
  });
});
