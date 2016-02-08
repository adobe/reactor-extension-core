import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import CartItemQuantity, { reducers } from '../cartItemQuantity';
import ValidationWrapper from '../../components/validationWrapper';
import dataElementNameField from '../components/dataElementNameField';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpConnectedForm(CartItemQuantity, reducers);
const getParts = () => {
  const validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  return {
    dataElementField: TestUtils.findRenderedComponentWithType(instance, dataElementNameField),
    dataElementValidationWrapper: validationWrappers[0],
    operatorField: TestUtils.findRenderedComponentWithType(instance, ComparisonOperatorField),
    quantityField: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield)[1],
    quantityValidationWrapper: validationWrappers[1]
  };
};

describe('cart item quantity view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getParts();

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        dataElement: 'foo',
        operator: '=',
        quantity: 12.50
      }
    });

    const { dataElementField, operatorField, quantityField } = getParts();

    expect(dataElementField.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(quantityField.props.value).toBe(12.50);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { dataElementField, operatorField, quantityField } = getParts();

    dataElementField.props.onChange('foo');
    operatorField.props.onChange('=');
    quantityField.props.onChange('12.50');

    expect(extensionBridge.getConfig()).toEqual({
      dataElement: 'foo',
      operator: '=',
      quantity: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      dataElementValidationWrapper,
      quantityValidationWrapper
    } = getParts();

    expect(dataElementValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(quantityValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if quantity value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { quantityField, quantityValidationWrapper } = getParts();

    quantityField.props.onChange('12.abc');

    expect(quantityValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
