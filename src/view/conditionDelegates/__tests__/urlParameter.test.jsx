import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import URLParameter from '../urlParameter';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

const { instance, extensionBridge } = setUpConnectedForm(URLParameter);
const getParts = () => {
  const validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  const textfields = TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield);
  return {
    nameField: textfields[0],
    nameValidationWrapper: validationWrappers[0],
    valueField: textfields[1],
    valueValidationWrapper: validationWrappers[1],
    regexToggle: TestUtils.findRenderedComponentWithType(instance, RegexToggle)
  };
};

describe('url parameter view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameField, valueField, regexToggle } = getParts();

    expect(nameField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(regexToggle.props.value).toBe('bar');
    expect(regexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, regexToggle } = getParts();

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    regexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      nameValidationWrapper,
      valueValidationWrapper
    } = getParts();

    expect(nameValidationWrapper.props.error).toEqual(jasmine.any(String));
    expect(valueValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
