import testListAction from '../../../__tests__/helpers/testListAction';
import reducer, { actionCreators } from '../deviceTypeActions';

describe('device type actions', () => {
  it('sets device types', () => {
    testListAction(reducer, actionCreators.setDeviceTypes, 'deviceTypes');
  });
});
