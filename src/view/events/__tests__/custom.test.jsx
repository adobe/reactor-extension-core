import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Custom from '../custom';
import CoralField from '../../components/coralField';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementSelector from '../components/elementSelector';

const getReactComponents = (wrapper) => {
  const textFields = wrapper.find(Textfield);

  const typeTextfield = textFields.filterWhere(n => n.prop('name') === 'type').node;

  const elementSelectorTextfield = textFields
    .filterWhere(n => n.prop('name') === 'elementSelector').node;
  const bubbleStopCheckbox = wrapper.find(Checkbox)
    .filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;
  const typeWrapper = wrapper.find(CoralField).filterWhere(n => n.prop('name') === 'type')
    .find(ValidationWrapper).node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;

  return {
    typeTextfield,
    typeWrapper,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    advancedEventOptions,
    elementSelectorWrapper
  };
};

describe('custom event view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'bar',
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(typeTextfield.props.value).toBe('bar');
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      typeTextfield,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    typeTextfield.props.onChange('bar');
    elementSelectorTextfield.props.onChange('.foo');
    bubbleStopCheckbox.props.onChange(true);

    const { type, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(type).toBe('bar');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { typeWrapper, elementSelectorWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(typeWrapper.props.error).toEqual(jasmine.any(String));
    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });
});
