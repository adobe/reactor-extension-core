import testBooleanAction from './helpers/testBooleanAction';
import reducer, {
  setDelayLinkActivation
} from '../delayLinkActivationActions';

describe('delay link activation actions', () => {
  it('sets delayLinkActivation', () => {
    testBooleanAction(reducer, setDelayLinkActivation, 'delayLinkActivation');
  });
});
