import Click from '../click';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('click view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Click, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        delayLinkActivation: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { delayLinkActivationCheckbox, elementFilter, advancedEventOptions } = instance.refs;

    expect(delayLinkActivationCheckbox.props.value).toBe(true);
    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayLinkActivationCheckbox, elementFilter, advancedEventOptions } = instance.refs;

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

    const { elementFilter } = instance.refs;

    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
