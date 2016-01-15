import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import Variable from '../variable';
import ValidationWrapper from '../../components/validationWrapper';

const {instance, extensionBridge} = setupComponent(Variable);
const getParts = () => {
  return {
    pathField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    pathValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper)
  };
};

describe('variable view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        path: 'foo'
      }
    });

    const { pathField } = getParts();

    expect(pathField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { pathField } = getParts();

    pathField.props.onChange('foo');

    expect(extensionBridge.getConfig()).toEqual({
      path: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { pathValidationWrapper } = getParts();

    expect(extensionBridge.validate()).toBe(false);
    expect(pathValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
