import { mount } from 'enzyme';
import OperatingSystem from '../operatingSystem';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import CheckboxList from '../../components/checkboxList';

const selectedOperatingSystems = [
  'Windows',
  'Unix'
];

const getReactComponents = (wrapper) => {
  const operatingSystemsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    operatingSystemsCheckboxList
  };
};

describe('operating system view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(OperatingSystem, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operatingSystems: selectedOperatingSystems
      }
    });

    const { operatingSystemsCheckboxList } = getReactComponents(instance);

    expect(operatingSystemsCheckboxList.props.value).toEqual(selectedOperatingSystems);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatingSystemsCheckboxList } = getReactComponents(instance);
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
