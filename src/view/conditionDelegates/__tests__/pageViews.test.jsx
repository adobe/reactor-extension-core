import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import PageViews, { reducers } from '../pageViews';
import ValidationWrapper from '../../components/validationWrapper';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpComponent(PageViews, reducers);
const getParts = () => {
  const radios = TestUtils.scryRenderedComponentsWithType(instance, Coral.Radio);
  return {
    operatorField: TestUtils.findRenderedComponentWithType(instance, ComparisonOperatorField),
    countField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    countValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper),
    lifetimeRadio: radios[0],
    sessionRadio: radios[1]
  };
};

describe('page views view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getParts();

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        operator: '=',
        count: 100,
        duration: 'session'
      }
    });

    const { operatorField, countField, lifetimeRadio, sessionRadio } = getParts();

    expect(operatorField.props.value).toBe('=');
    expect(countField.props.value).toBe(100);
    expect(lifetimeRadio.props.checked).toBe(false);
    expect(sessionRadio.props.checked).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatorField, countField, sessionRadio } = getParts();

    operatorField.props.onChange('=');
    countField.props.onChange(100);
    sessionRadio.props.onChange('session');

    expect(extensionBridge.getConfig()).toEqual({
      operator: '=',
      count: 100,
      duration: 'session'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countValidationWrapper } = getParts();

    expect(countValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countField, countValidationWrapper } = getParts();

    countField.props.onChange('12.abc');

    expect(countValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
