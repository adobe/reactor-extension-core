import DeviceType from '../deviceType';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const selectedDeviceTypes = [
  'Desktop',
  'Android'
];

describe('device type view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(DeviceType, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        deviceTypes: selectedDeviceTypes
      }
    });

    const { deviceOptionsCheckboxList } = instance.refs;

    expect(deviceOptionsCheckboxList.props.value).toEqual(selectedDeviceTypes);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { deviceOptionsCheckboxList } = instance.refs;
    deviceOptionsCheckboxList.props.onChange(selectedDeviceTypes);

    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: selectedDeviceTypes
    });
  });

  it('sets deviceTypes to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      deviceTypes: []
    });
  });
});
