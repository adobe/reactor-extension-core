import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import DeviceType, { reducers } from '../deviceType';
import CheckboxList from '../../components/checkboxList';

const {instance, extensionBridge} = setupComponent(DeviceType, reducers);
const getParts = () => {
  return {
    checkboxList: TestUtils.findRenderedComponentWithType(instance, CheckboxList)
  };
};

const selectedDeviceTypes = [
  'Desktop',
  'Android'
];

describe('device type view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        deviceTypes: selectedDeviceTypes
      }
    });

    const { checkboxList } = getParts();

    expect(checkboxList.props.value).toEqual(selectedDeviceTypes);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { checkboxList } = getParts();
    checkboxList.props.onChange(selectedDeviceTypes);

    expect(extensionBridge.getConfig()).toEqual({
      deviceTypes: selectedDeviceTypes
    });
  });

  it('sets deviceTypes to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getConfig()).toEqual({
      deviceTypes: []
    });
  });
});
