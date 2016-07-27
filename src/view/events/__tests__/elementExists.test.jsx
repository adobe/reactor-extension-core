import { mount } from 'enzyme';
import ElementExists from '../elementExists';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import SpecificElements from '../components/specificElements';

const getReactComponents = (wrapper) => {
  const specificElements = wrapper.find(SpecificElements).node;

  return {
    specificElements
  };
};

describe('element exists view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(ElementExists, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { specificElements } = getReactComponents(instance);

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { specificElements } = getReactComponents(instance);

    specificElements.props.fields.elementSelector.onChange('.foo');

    const { elementSelector } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { specificElements } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
