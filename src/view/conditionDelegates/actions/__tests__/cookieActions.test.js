import testStringAction from '../../../__tests__/helpers/testStringAction';
import testBooleanAction from '../../../__tests__/helpers/testBooleanAction';
import reducer, { actionCreators } from '../cookieActions';

describe('cookie actions', () => {
  it('sets name', () => {
    testStringAction(reducer, actionCreators.setName, 'name');
  });

  it('sets value', () => {
    testStringAction(reducer, actionCreators.setValue, 'value');
  });

  it('sets valueIsRegex', () => {
    testBooleanAction(reducer, actionCreators.setValueIsRegex, 'valueIsRegex');
  });
});
