import testStringAction from '../../../__tests__/helpers/testStringAction';
import reducer, { actionCreators } from '../variableActions';

describe('variable actions', () => {
  it('sets path', () => {
    testStringAction(reducer, actionCreators.setPath, 'path');
  });
});
