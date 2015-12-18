import testStringAction from '../../../__tests__/helpers/testStringAction';
import reducer, { actionCreators } from '../queryParamActions';

describe('query parameter actions', () => {
  it('sets query parameter name', () => {
    testStringAction(reducer, actionCreators.setName, 'name');
  });

  it('sets case-insensitive', () => {
    testStringAction(reducer, actionCreators.setCaseInsensitive, 'caseInsensitive');
  });
});
