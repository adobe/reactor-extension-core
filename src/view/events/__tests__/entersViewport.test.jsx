import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Radio from '@coralui/react-coral/lib/Radio';
import { ValidationWrapper } from '@reactor/react-components';
import EntersViewport from '../entersViewport';
import DelayType from '../components/delayType';
import ElementSelector from '../components/elementSelector';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const textFields = wrapper.find(Textfield);

  const elementSelectorTextfield = textFields
    .filterWhere(n => n.prop('name') === 'elementSelector').node;
  const delayTextfield = textFields.filterWhere(n => n.prop('name') === 'delay').node;
  const delayRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'delay').node;
  const delayValidationWrapper = wrapper.find(DelayType).find(ValidationWrapper).node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;

  return {
    elementSelectorTextfield,
    delayTextfield,
    delayRadio,
    delayValidationWrapper,
    elementSelectorWrapper
  };
};

describe('enters viewport view', () => {
  let extensionBridge;
  let instance;

  beforeEach(() => {
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

    const { elementSelectorTextfield, delayTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
    expect(delayTextfield.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayRadio } = getReactComponents(instance);
    delayRadio.props.onChange('delay');

    const { elementSelectorTextfield, delayTextfield } = getReactComponents(instance);
    elementSelectorTextfield.props.onChange('.foo');
    delayTextfield.props.onChange(100);

    const { elementSelector, delay } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

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
