import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import CartAmount from '../cartAmount';
import ValidationWrapper from '../../components/validationWrapper';
import dataElementNameField from '../components/dataElementNameField';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpConnectedForm(CartAmount);

const getParts = () => {
  const validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  return {
    dataElementField: TestUtils.findRenderedComponentWithType(instance, dataElementNameField),
    dataElementValidationWrapper: validationWrappers[0],
    operatorField: TestUtils.findRenderedComponentWithType(instance, ComparisonOperatorField),
    amountField: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield)[1],
    amountValidationWrapper: validationWrappers[1]
  };
};

describe('cart amount view', () => {
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
        amount: 12.50
      }
    });

    const { dataElementField, operatorField, amountField } = getParts();

    expect(dataElementField.props.value).toBe('foo');
    expect(operatorField.props.value).toBe('=');
    expect(amountField.props.value).toBe(12.50);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { dataElementField, operatorField, amountField } = getParts();

    dataElementField.props.onChange('foo');
    operatorField.props.onChange('=');
    amountField.props.onChange('12.50');

    expect(extensionBridge.getConfig()).toEqual({
      dataElement: 'foo',
      operator: '=',
      amount: 12.50
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      dataElementValidationWrapper,
      amountValidationWrapper
    } = getParts();

    expect(dataElementValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(amountValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if amount value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { amountField, amountValidationWrapper } = getParts();

    amountField.props.onChange('12.abc');

    expect(amountValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
