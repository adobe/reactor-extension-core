import extensionViewReduxForm from '../../../extensionViewReduxForm';
import { mount } from 'enzyme';
import ElementPropertiesEditor, { formConfig } from '../elementPropertiesEditor';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementPropertyEditor from '../elementPropertyEditor';
import Button from '@coralui/react-coral/lib/Button';

const getReactComponents = (wrapper) => {
  const elementPropertyEditors = wrapper.find(ElementPropertyEditor).nodes;
  const addButton = wrapper.find(Button).filterWhere(n => n.prop('icon') !== 'close').node;

  return {
    elementPropertyEditors,
    addButton
  };
};

describe('elementPropertiesEditor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ElementPropertiesEditor);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          }
        ]
      }
    });

    const { elementPropertyEditors } = getReactComponents(instance);
    expect(elementPropertyEditors[0].props.fields.name.value).toBe('some prop');
    expect(elementPropertyEditors[0].props.fields.value.value).toBe('some value');
    expect(elementPropertyEditors[0].props.fields.valueIsRegex.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { elementPropertyEditors } = getReactComponents(instance);

    elementPropertyEditors[0].props.fields.name.onChange('some prop set');
    elementPropertyEditors[0].props.fields.value.onChange('some value set');
    elementPropertyEditors[0].props.fields.valueIsRegex.onChange(true);

    const { elementProperties } = extensionBridge.getSettings();
    expect(elementProperties).toEqual([
      {
        name: 'some prop set',
        value: 'some value set',
        valueIsRegex: true
      }
    ]);
  });

  it('sets error if element property name field is empty and value is not empty', () => {
    extensionBridge.init();

    const { elementPropertyEditors } = getReactComponents(instance);

    elementPropertyEditors[0].props.fields.value.onChange('foo');

    expect(extensionBridge.validate()).toBe(false);

    expect(elementPropertyEditors[0].props.fields.name.touched).toBe(true);
    expect(elementPropertyEditors[0].props.fields.name.error).toEqual(jasmine.any(String));
  });

  it('creates a new row when the add button is clicked', () => {
    extensionBridge.init();

    const { addButton } = getReactComponents(instance);
    addButton.props.onClick();

    const { elementPropertyEditors } = getReactComponents(instance);

    // First row is visible by default.
    expect(elementPropertyEditors[0]).toBeDefined();
    expect(elementPropertyEditors[1]).toBeDefined();
    expect(elementPropertyEditors[2]).toBeUndefined();
  });

  it('deletes a row when requested from row', () => {
    extensionBridge.init({
      settings: {
        elementProperties: [
          {
            name: 'some prop',
            value: 'some value',
            valueIsRegex: true
          },
          {
            name: 'some prop2',
            value: 'some value2',
            valueIsRegex: true
          }
        ]
      }
    });

    let { elementPropertyEditors } = getReactComponents(instance);
    elementPropertyEditors[0].props.remove();

    ({ elementPropertyEditors } = getReactComponents(instance));

    // First row is visible by default.
    expect(elementPropertyEditors[0]).toBeDefined();
    expect(elementPropertyEditors[1]).toBeUndefined();

    expect(elementPropertyEditors[0].props.fields.name.value).toBe('some prop2');
    expect(elementPropertyEditors[0].props.fields.value.value).toBe('some value2');
  });
});
