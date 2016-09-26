import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import { ValidationWrapper } from '@reactor/react-components';

import DelayType from '../components/delayType';
import Hover from '../hover';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementSelector from '../components/elementSelector';

const getReactComponents = (wrapper) => {
  const elementSelectorTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'elementSelector').node;
  const bubbleStopCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const delayTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'delay').node;
  const delayRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'delay').node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;
  const delayValidationWrapper = wrapper.find(DelayType).find(ValidationWrapper).node;

  return {
    elementSelectorTextfield,
    bubbleStopCheckbox,
    delayTextfield,
    delayRadio,
    advancedEventOptions,
    delayValidationWrapper,
    elementSelectorWrapper
  };
};

describe('hover view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Hover, extensionBridge));

    extensionBridge.init();

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(delayTextfield.props.value).toBe(100);
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    const { delayRadio } = getReactComponents(instance);
    delayRadio.props.onChange('delay');

    const {
      elementSelectorTextfield,
      delayTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('.foo');
    delayTextfield.props.onChange(100);
    bubbleStopCheckbox.props.onChange(true);

    const { elementSelector, delay, bubbleStop } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    const {
      delayRadio,
      delayValidationWrapper,
      elementSelectorWrapper
    } = getReactComponents(instance);
    delayRadio.props.onChange('delay');

    expect(extensionBridge.validate()).toBe(false);

    expect(delayValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });
});
