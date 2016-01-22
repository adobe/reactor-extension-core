import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import ScreenResolution, { reducers } from '../screenResolution';
import ValidationWrapper from '../../components/validationWrapper';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpComponent(ScreenResolution, reducers);
const getParts = () => {
  const operatorFields = TestUtils.scryRenderedComponentsWithType(instance, ComparisonOperatorField);
  const validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  const textfields = TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield);

  return {
    widthOperatorField: operatorFields[0],
    widthField: textfields[0],
    widthValidationWrapper: validationWrappers[0],
    heightOperatorField: operatorFields[1],
    heightField: textfields[1],
    heightValidationWrapper: validationWrappers[1]
  };
};

describe('screen resolution view', () => {
  it('sets operators to greater than by default', () => {
    extensionBridge.init();

    const { widthOperatorField, heightOperatorField } = getParts();

    expect(widthOperatorField.props.value).toBe('>');
    expect(heightOperatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    const { widthOperatorField, widthField, heightOperatorField, heightField } = getParts();

    expect(widthOperatorField.props.value).toBe('=');
    expect(widthField.props.value).toBe(100);
    expect(heightOperatorField.props.value).toBe('<');
    expect(heightField.props.value).toBe(200);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { widthOperatorField, widthField, heightOperatorField, heightField } = getParts();

    widthOperatorField.props.onChange('=');
    widthField.props.onChange(100);
    heightOperatorField.props.onChange('<');
    heightField.props.onChange(200);

    expect(extensionBridge.getConfig()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      widthValidationWrapper,
      heightValidationWrapper
    } = getParts();

    expect(widthValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets errors if values are not numbers', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      widthField,
      widthValidationWrapper,
      heightField,
      heightValidationWrapper
    } = getParts();

    widthField.props.onChange('12.abc');
    heightField.props.onChange('12.abc');

    expect(widthValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
