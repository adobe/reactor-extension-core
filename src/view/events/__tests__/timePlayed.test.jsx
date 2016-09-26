import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Select from '@coralui/react-coral/lib/Select';

import ElementSelector from '../components/elementSelector';
import AdvancedEventOptions from '../components/advancedEventOptions';
import TimePlayed from '../timePlayed';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const amountField = wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'amount').node;
  const unitSelect = wrapper.find(Select).node;
  const elementSelectorTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'elementSelector').node;
  const bubbleStopCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name') === 'bubbleStop').node;
  const amountWrapper = wrapper.find(ValidationWrapper).node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    amountField,
    unitSelect,
    elementSelectorTextfield,
    bubbleStopCheckbox,
    amountWrapper,
    elementSelectorWrapper,
    advancedEventOptions
  };
};

describe('time played view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TimePlayed, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        amount: 55,
        unit: 'percent',
        bubbleStop: true
      }
    });

    const { advancedEventOptions } = getReactComponents(instance);
    advancedEventOptions.toggleSelected();

    const {
      amountField,
      unitSelect,
      elementSelectorTextfield,
      bubbleStopCheckbox
    } = getReactComponents(instance);

    expect(amountField.props.value).toBe(55);
    expect(unitSelect.props.value).toBe('percent');
    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(bubbleStopCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      amountField,
      elementSelectorTextfield,
      advancedEventOptions
    } = getReactComponents(instance);

    amountField.props.onChange(45);
    elementSelectorTextfield.props.onChange('.foo');

    advancedEventOptions.toggleSelected();
    const { bubbleStopCheckbox } = getReactComponents(instance);
    bubbleStopCheckbox.props.onChange(true);

    const { amount, unit, elementSelector, bubbleStop } = extensionBridge.getSettings();
    expect(amount).toBe(45);
    expect(unit).toBe('second');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { amountWrapper, elementSelectorWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(amountWrapper.props.error).toEqual(jasmine.any(String));
    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });
});
