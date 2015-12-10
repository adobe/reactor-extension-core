import testBooleanAction from './helpers/testBooleanAction';
import reducer, {
  setBubbleFireIfParent,
  setBubbleFireIfChildFired,
  setBubbleStop
} from '../bubbleActions';

describe('bubble actions', () => {
  it('sets bubbleFireIfParent', () => {
    testBooleanAction(reducer, setBubbleFireIfParent, 'bubbleFireIfParent');
  });

  it('sets bubbleFireIfChildFired', () => {
    testBooleanAction(reducer, setBubbleFireIfChildFired, 'bubbleFireIfChildFired');
  });

  it('sets bubbleStop', () => {
    testBooleanAction(reducer, setBubbleStop, 'bubbleStop');
  });
});
