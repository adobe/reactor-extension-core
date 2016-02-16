import TestUtils from 'react-addons-test-utils';

import DeviceType from '../deviceType';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(DeviceType);

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

    const { deviceOptionsCheckboxList } = instance.refs;

    expect(deviceOptionsCheckboxList.props.value).toEqual(selectedDeviceTypes);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { deviceOptionsCheckboxList } = instance.refs;
    deviceOptionsCheckboxList.props.onChange(selectedDeviceTypes);

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
