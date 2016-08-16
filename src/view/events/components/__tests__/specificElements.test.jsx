import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import SpecificElements, { formConfig } from '../specificElements';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementPropertiesEditor from '../elementPropertiesEditor';
import ElementSelectorField from '../elementSelectorField';
import extensionViewReduxForm from '../../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const showElementPropertiesCheckbox = wrapper.find(Checkbox).node;
  const elementPropertiesEditor = wrapper.find(ElementPropertiesEditor).node;
  const elementSelectorField = wrapper.find(ElementSelectorField).node;

  return {
    showElementPropertiesCheckbox,
    elementPropertiesEditor,
    elementSelectorField
  };
};

describe('specificElements', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(SpecificElements);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('updates view properly when elementProperties provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props.checked).toBe(true);
    expect(elementPropertiesEditor).toBeDefined();
    expect(elementPropertiesEditor.props.fields.elementProperties).toBeDefined();
  });

  it('updates view properly when elementProperties not provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = getReactComponents(instance);
    expect(showElementPropertiesCheckbox.props.checked).toBe(false);
    expect(elementPropertiesEditor).toBeUndefined();
  });

  it('removes elementProperties from settings if element properties hidden', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings().elementProperties).toBeUndefined();
  });

  it('sets error if elementSelector is not specified', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorField } = getReactComponents(instance);

    expect(elementSelectorField.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });

  it('removes elementProperties error if element properties not shown', () => {
    // An element property with a value but not a name would typically create a validation error
    // if the element properties editor were visible.
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = getReactComponents(instance);

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.validate()).toBe(true);
  });
});
