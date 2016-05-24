import OperatingSystem from '../operatingSystem';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const selectedOperatingSystems = [
  'Windows',
  'Unix'
];

describe('operating system view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(OperatingSystem, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operatingSystems: selectedOperatingSystems
      }
    });

    const { operatingSystemsCheckboxList } = instance.refs;

    expect(operatingSystemsCheckboxList.props.value).toEqual(selectedOperatingSystems);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatingSystemsCheckboxList } = instance.refs;
    operatingSystemsCheckboxList.props.onChange(selectedOperatingSystems);

    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: selectedOperatingSystems
    });
  });

  it('sets operatingSystems to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: []
    });
  });
});
