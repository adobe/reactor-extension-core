import { mount } from 'enzyme';
import EntersViewport from '../entersViewport';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import SpecificElements from '../components/specificElements';
import DelayType from '../components/delayType';

const getReactComponents = (wrapper) => {
  const specificElements = wrapper.find(SpecificElements).node;
  const delayType = wrapper.find(DelayType).node;

  return {
    specificElements,
    delayType
  };
};

describe('enters viewport view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(EntersViewport, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100
      }
    });

    const { specificElements, delayType } = getReactComponents(instance);

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
    expect(delayType.props.fields.delay.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { specificElements, delayType } = getReactComponents(instance);

    specificElements.props.fields.elementSelector.onChange('.foo');
    delayType.props.fields.delayType.onChange('delay');
    delayType.props.fields.delay.onChange(100);

    const { elementSelector, delay } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { specificElements, delayType } = getReactComponents(instance);

    delayType.props.fields.delayType.onChange('delay');

    expect(extensionBridge.validate()).toBe(false);

    expect(delayType.props.fields.delay.error).toEqual(jasmine.any(String));
    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
