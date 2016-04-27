import CartItemQuantity from '../cartItemQuantity';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('cart item quantity view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    instance = getFormInstance(CartItemQuantity, extensionBridge);
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element button', () => {
    const { dataElementField, dataElementButton } = instance.refs;

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    dataElementButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(dataElementField.props.value).toBe('foo');
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = instance.refs;

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo',
        operator: '=',
        quantity: 12.50
      }
    });

    const { dataElementField, operatorField, quantityField } = instance.refs;

    expect(dataElementField.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(quantityField.props.value).toBe(12.50);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementField, operatorField, quantityField } = instance.refs;

    dataElementField.props.onChange('foo');
    operatorField.props.onChange('=');
    quantityField.props.onChange('12.50');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo',
      operator: '=',
      quantity: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementWrapper, quantityWrapper } = instance.refs;

    expect(dataElementWrapper.props.error).toEqual(jasmine.any(String));
    expect(quantityWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if quantity value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { quantityField, quantityWrapper } = instance.refs;

    quantityField.props.onChange('12.abc');

    expect(quantityWrapper.props.error).toEqual(jasmine.any(String));
  });
});
