import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../queryParamActions';

describe('query parameter actions', () => {
  it('sets query parameter name', () => {
    testPassThroughAction(reducer, actionCreators.setName, 'name');
  });

  it('sets case-insensitive', () => {
    testPassThroughAction(reducer, actionCreators.setCaseInsensitive, 'caseInsensitive');
  });
});
