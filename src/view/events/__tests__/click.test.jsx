import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import { ValidationWrapper } from '@reactor/react-components';
import Click from '../click';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementSelector from '../components/elementSelector';

const getReactComponents = (wrapper) => {
  const checkboxes = wrapper.find(Checkbox);

  const delayLinkActivationCheckbox = checkboxes
    .filterWhere(n => n.prop('name') === 'delayLinkActivation').node;
  const elementSelectorTextfield = wrapper.find(Textfield)
    .filterWhere(n => n.prop('name') === 'elementSelector').node;
  const bubbleStopCheckbox = checkboxes.filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;

  return {
    delayLinkActivationCheckbox,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    elementSelectorWrapper,
    advancedEventOptions
  };
};

describe('click view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
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

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      delayLinkActivationCheckbox,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(delayLinkActivationCheckbox.props.value).toBe(true);
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      delayLinkActivationCheckbox,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    delayLinkActivationCheckbox.props.onChange(true);
    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { delayLinkActivation, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(delayLinkActivation).toBe(true);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementSelectorWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });
});
