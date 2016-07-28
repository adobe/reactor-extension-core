import { mount } from 'enzyme';
import DOM from '../dom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import { ReduxFormSelect as Select, ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

const getReactComponents = (wrapper) => {
  const elementPropertyPresetsSelect = wrapper.find(Select).node;
  const elementSelectorField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'elementSelector').node;
  const customElementPropertyField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'customElementProperty').node;
  const elementSelectorWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'elementSelector').node;
  const customElementPropertyWrapper = wrapper
    .find(ValidationWrapper).filterWhere(n => n.prop('type') === 'customElementProperty').node;

  return {
    elementPropertyPresetsSelect,
    elementSelectorField,
    customElementPropertyField,
    elementSelectorWrapper,
    customElementPropertyWrapper
  };
};

describe('DOM view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(DOM, extensionBridge));
  });

  it('selects ID preset for new settings', () => {
    extensionBridge.init();

    const { elementPropertyPresetsSelect } = getReactComponents(instance);

    expect(elementPropertyPresetsSelect.props.value).toBe('id');
  });


  it('sets form values from settings using element property preset', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      }
    });

    const { elementSelectorField, elementPropertyPresetsSelect } = getReactComponents(instance);

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetsSelect.props.value).toBe('innerHTML');
  });

  it('sets form values from settings using custom element property', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: 'bar'
      }
    });

    const {
      elementSelectorField,
      elementPropertyPresetsSelect,
      customElementPropertyField
    } = getReactComponents(instance);

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetsSelect.props.value).toBe('custom');
    expect(customElementPropertyField.props.value).toBe('bar');
  });

  it('sets error if element selector not provided', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorWrapper } = getReactComponents(instance);

    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets settings from form values using element property preset', () => {
    extensionBridge.init();

    const { elementSelectorField, elementPropertyPresetsSelect } = getReactComponents(instance);

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange('innerHTML');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML'
    });
  });

  it('sets settings from form values using custom element property', () => {
    extensionBridge.init();

    const {
      elementSelectorField,
      elementPropertyPresetsSelect
      } = getReactComponents(instance);

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange('custom');

    const {
      customElementPropertyField
    } = getReactComponents(instance);

    customElementPropertyField.props.onChange('bar');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'bar'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo',
        elementProperty: ''
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { customElementPropertyWrapper } = getReactComponents(instance);

    expect(customElementPropertyWrapper.props.error).toEqual(jasmine.any(String));
  });
});
