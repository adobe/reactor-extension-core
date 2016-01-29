import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import TrafficSource from '../trafficSource';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

const { instance, extensionBridge } = setUpComponent(TrafficSource);
const getParts = () => {
  return {
    sourceField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    sourceValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper),
    regexToggle: TestUtils.findRenderedComponentWithType(instance, RegexToggle)
  };
};

describe('traffic source view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    const { sourceField, regexToggle } = getParts();

    expect(sourceField.props.value).toBe('foo');
    expect(regexToggle.props.value).toBe('foo');
    expect(regexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { sourceField, regexToggle } = getParts();

    sourceField.props.onChange('foo');
    regexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      sourceValidationWrapper
    } = getParts();

    expect(sourceValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
