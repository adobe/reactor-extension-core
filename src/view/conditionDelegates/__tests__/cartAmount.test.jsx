import CartAmount from '../cartAmount';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('cart amount view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    extensionBridge.openDataElementSelector = jasmine.createSpy();
    window.extensionBridge = extensionBridge;
    instance = getFormInstance(CartAmount, extensionBridge);
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element field', () => {
    const { dataElementField } = instance.refs;

    dataElementField.props.onOpenSelector();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
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
        amount: 12.50
      }
    });

    const { dataElementField, operatorField, amountField } = instance.refs;

    expect(dataElementField.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(amountField.props.value).toBe(12.50);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementField, operatorField, amountField } = instance.refs;

    dataElementField.props.onChange('foo');
    operatorField.props.onChange('=');
    amountField.props.onChange('12.50');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo',
      operator: '=',
      amount: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementWrapper, amountWrapper} = instance.refs;

    expect(dataElementWrapper.props.error).toEqual(jasmine.any(String));
    expect(amountWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if amount value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { amountField, amountWrapper } = instance.refs;

    amountField.props.onChange('12.abc');

    expect(amountWrapper.props.error).toEqual(jasmine.any(String));
  });
});
