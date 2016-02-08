import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Sessions, { reducers } from '../sessions';
import ValidationWrapper from '../../components/validationWrapper';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const { instance, extensionBridge } = setUpConnectedForm(Sessions, reducers);
const getParts = () => {
  return {
    operatorField: TestUtils.findRenderedComponentWithType(instance, ComparisonOperatorField),
    countField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    countValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper)
  };
};

describe('sessions view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = getParts();

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        operator: '=',
        count: 100
      }
    });

    const { operatorField, countField } = getParts();

    expect(operatorField.props.value).toBe('=');
    expect(countField.props.value).toBe(100);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatorField, countField } = getParts();

    operatorField.props.onChange('=');
    countField.props.onChange(100);

    expect(extensionBridge.getConfig()).toEqual({
      operator: '=',
      count: 100
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
