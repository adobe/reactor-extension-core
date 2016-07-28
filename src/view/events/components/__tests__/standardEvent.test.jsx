import { mount } from 'enzyme';
import StandardEvent from '../../components/standardEvent';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementFilter from '../elementFilter';
import AdvancedEventOptions from '../advancedEventOptions';

const getReactComponents = (wrapper) => {
  const elementFilter = wrapper.find(ElementFilter).node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    elementFilter,
    advancedEventOptions
  };
};

describe('standard event view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(StandardEvent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { elementFilter, advancedEventOptions } = getReactComponents(instance);

    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { elementFilter, advancedEventOptions } = getReactComponents(instance);

    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { elementSelector, bubbleStop } = extensionBridge.getSettings();
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementFilter } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
