import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import LandingPage from '../landingPage';
import ValidationWrapper from '../../components/validationWrapper';
import RegexToggle from '../../components/regexToggle';

const { instance, extensionBridge } = setUpConnectedForm(LandingPage);
const getParts = () => {
  return {
    pageField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    pageValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper),
    regexToggle: TestUtils.findRenderedComponentWithType(instance, RegexToggle)
  };
};

describe('landing page view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    const { pageField, regexToggle } = getParts();

    expect(pageField.props.value).toBe('foo');
    expect(regexToggle.props.value).toBe('foo');
    expect(regexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { pageField, regexToggle } = getParts();

    pageField.props.onChange('foo');
    regexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const {
      pageValidationWrapper
    } = getParts();

    expect(pageValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
