import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';

import DOM from '../dom';
import CoralField from '../../components/coralField';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const elementPropertyPresetsSelect = wrapper.find(Select).node;
  const elementSelectorTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'elementSelector').node;
  const customElementPropertyField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'customElementProperty').node;
  const elementSelectorWrapper = wrapper.find(CoralField)
    .filterWhere(n => n.prop('name') === 'elementSelector').find(ValidationWrapper).node;
  const customElementPropertyWrapper = wrapper.find(CoralField)
    .filterWhere(n => n.prop('name') === 'customElementProperty').find(ValidationWrapper).node;

  return {
    elementPropertyPresetsSelect,
    elementSelectorTextfield,
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

    const { elementSelectorTextfield, elementPropertyPresetsSelect } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('foo');
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
      elementSelectorTextfield,
      elementPropertyPresetsSelect,
      customElementPropertyField
    } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('foo');
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

    const { elementSelectorTextfield, elementPropertyPresetsSelect } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange({
      value: 'innerHTML',
      label: 'HTML'
    });

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML'
    });
  });

  it('sets settings from form values using custom element property', () => {
    extensionBridge.init();

    const {
      elementSelectorTextfield,
      elementPropertyPresetsSelect
      } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('foo');
    elementPropertyPresetsSelect.props.onChange({
      value: 'custom',
      label: 'other attribute'
    });

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
