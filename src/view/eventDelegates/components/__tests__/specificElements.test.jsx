import TestUtils from 'react-addons-test-utils';
import setUpConnectedForm from '../../../__tests__/helpers/setUpConnectedForm';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import SpecificElements, { formConfig } from '../specificElements';

const FormComponent = extensionViewReduxForm(formConfig)(SpecificElements);

const { instance, extensionBridge } = setUpConnectedForm(FormComponent);

describe('specificElements', () => {
  it('updates view properly when elementProperties provided', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = instance.refs;
    expect(showElementPropertiesCheckbox.props.checked).toBe(true);
    expect(elementPropertiesEditor).toBeDefined();
    expect(elementPropertiesEditor.props.fields.elementProperties).toBeDefined();
  });

  it('updates view properly when elementProperties not provided', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo'
      }
    });

    const { showElementPropertiesCheckbox, elementPropertiesEditor } = instance.refs;
    expect(showElementPropertiesCheckbox.props.checked).toBe(false);
    expect(elementPropertiesEditor).toBeUndefined();
  });

  it('removes elementProperties from config if element properties hidden', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = instance.refs;

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.getConfig().elementProperties).toBeUndefined();
  });

  it('sets error if elementSelector is not specified', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorField } = instance.refs;

    expect(elementSelectorField.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });

  it('removes elementProperties error if element properties not shown', () => {
    // An element property with a value but not a name would typically create a validation error
    // if the element properties editor were visible.
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        elementProperties: [
          {
            value: 'b'
          }
        ]
      }
    });

    const { showElementPropertiesCheckbox } = instance.refs;

    showElementPropertiesCheckbox.props.onChange(false);

    expect(extensionBridge.validate()).toBe(true);
  });
});
