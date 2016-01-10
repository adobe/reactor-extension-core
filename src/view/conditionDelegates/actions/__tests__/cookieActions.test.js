import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../cookieActions';

describe('cookie actions', () => {
  it('sets name', () => {
    testPassThroughAction(reducer, actionCreators.setName, 'name');
  });

  it('sets value', () => {
    testPassThroughAction(reducer, actionCreators.setValue, 'value');
  });

  it('sets valueIsRegex', () => {
    testPassThroughAction(reducer, actionCreators.setValueIsRegex, 'valueIsRegex');
  });
});
