import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import TimeOnSite, { reducers } from '../timeOnSite';
import ValidationWrapper from '../../components/validationWrapper';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpConnectedForm(TimeOnSite, reducers);
const getParts = () => {
  return {
    operatorField: TestUtils.findRenderedComponentWithType(instance, ComparisonOperatorField),
    minutesField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    minutesValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper)
  };
};

describe('time on site view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getParts();

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        operator: '=',
        minutes: 100
      }
    });

    const { operatorField, minutesField } = getParts();

    expect(operatorField.props.value).toBe('=');
    expect(minutesField.props.value).toBe(100);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatorField, minutesField } = getParts();

    operatorField.props.onChange('=');
    minutesField.props.onChange(100);

    expect(extensionBridge.getConfig()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesValidationWrapper } = getParts();

    expect(minutesValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesField, minutesValidationWrapper } = getParts();

    minutesField.props.onChange('12.abc');

    expect(minutesValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
