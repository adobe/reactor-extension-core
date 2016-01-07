import testPassThroughAction from '../../../__tests__/helpers/testPassThroughAction';
import reducer, { actionCreators } from '../variableActions';

describe('variable actions', () => {
  it('sets path', () => {
    testPassThroughAction(reducer, actionCreators.setPath, 'path');
  });
});
