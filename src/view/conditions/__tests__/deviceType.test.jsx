import { mount } from 'enzyme';

import DeviceType from '../deviceType';
import CheckboxList from '../../components/checkboxList';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const selectedDeviceTypes = [
  'Desktop',
  'Android'
];

const getReactComponents = (wrapper) => {
  const deviceOptionsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    deviceOptionsCheckboxList
  };
};

describe('device type view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(DeviceType, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        deviceTypes: selectedDeviceTypes
      }
    });

    const { deviceOptionsCheckboxList } = getReactComponents(instance);

    expect(deviceOptionsCheckboxList.props.value).toEqual(selectedDeviceTypes);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { deviceOptionsCheckboxList } = getReactComponents(instance);
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
