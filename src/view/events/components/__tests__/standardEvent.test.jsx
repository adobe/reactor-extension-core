import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import { ValidationWrapper } from '@reactor/react-components';
import StandardEvent from '../../components/standardEvent';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../advancedEventOptions';
import ElementSelector from '../elementSelector';

const getReactComponents = (wrapper) => {
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;
  const elementSelectorTextfield = wrapper.find(Textfield)
    .filterWhere(n => n.prop('name') === 'elementSelector').node;
  const bubbleStopCheckbox = wrapper.find(Checkbox)
    .filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;

  return {
    elementSelectorTextfield,
    bubbleStopCheckbox,
    advancedEventOptions,
    elementSelectorWrapper
  };
};

describe('standard event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
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

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const { elementSelectorTextfield, bubbleStopCheckbox } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const { elementSelectorTextfield, bubbleStopCheckbox } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { elementSelector, bubbleStop } = extensionBridge.getSettings();
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
