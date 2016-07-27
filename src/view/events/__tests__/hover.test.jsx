import { mount } from 'enzyme';
import Hover from '../hover';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import SpecificElements from '../components/specificElements';
import DelayType from '../components/delayType';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const specificElements = wrapper.find(SpecificElements).node;
  const delayType = wrapper.find(DelayType).node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    specificElements,
    delayType,
    advancedEventOptions
  };
};

describe('hover view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Hover, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    const { specificElements, delayType, advancedEventOptions } = getReactComponents(instance);

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
    expect(delayType.props.fields.delay.value).toBe(100);
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { specificElements, delayType, advancedEventOptions } = getReactComponents(instance);

    specificElements.props.fields.elementSelector.onChange('.foo');
    delayType.props.fields.delayType.onChange('delay');
    delayType.props.fields.delay.onChange(100);
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { elementSelector, delay, bubbleStop } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
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
