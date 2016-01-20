import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import DataElement from '../dataElement';
import ValidationWrapper from '../../components/validationWrapper';
import DataElementNameField from '../components/dataElementNameField';
import RegexToggle from '../../components/regexToggle';

const { instance, extensionBridge } = setUpComponent(DataElement);
const getParts = () => {
  const validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  return {
    dataElementField: TestUtils.findRenderedComponentWithType(instance, DataElementNameField),
    dataElementValidationWrapper: validationWrappers[0],
    valueField: TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield)[1],
    valueValidationWrapper: validationWrappers[1],
    regexToggle: TestUtils.findRenderedComponentWithType(instance, RegexToggle)
  };
};

describe('data element view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        dataElement: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { dataElementField, valueField, regexToggle } = getParts();

    expect(dataElementField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(regexToggle.props.value).toBe('bar');
    expect(regexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { dataElementField, valueField, regexToggle } = getParts();

    dataElementField.props.onChange('foo');
    valueField.props.onChange('bar');
    regexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      dataElement: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      dataElementValidationWrapper,
      valueValidationWrapper
    } = getParts();

    expect(dataElementValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(valueValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
