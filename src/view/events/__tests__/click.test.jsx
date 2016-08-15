import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import Click from '../click';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ElementFilter from '../components/elementFilter';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const delayLinkActivationCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'delayLinkActivation').node;
  const elementFilter = wrapper.find(ElementFilter).node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    delayLinkActivationCheckbox,
    elementFilter,
    advancedEventOptions
  };
};

describe('click view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Click, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        delayLinkActivation: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const {
      delayLinkActivationCheckbox,
      elementFilter,
      advancedEventOptions
    } = getReactComponents(instance);

    expect(delayLinkActivationCheckbox.props.value).toBe(true);
    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      delayLinkActivationCheckbox,
      elementFilter,
      advancedEventOptions
    } = getReactComponents(instance);

    delayLinkActivationCheckbox.props.onChange(true);
    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { delayLinkActivation, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(delayLinkActivation).toBe(true);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementFilter } = getReactComponents(instance);

    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
