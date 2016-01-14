import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import Cookie from '../cookie';
import RegexToggle from '../../components/regexToggle';
import ValidationWrapper from '../../components/regexToggle';

const {instance, extensionBridge} = setupComponent(Cookie)
const getParts = instance => {
  return {
    nameField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    nameValidationWrapper: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield)
  };
};

describe('cookie view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo'
      }
    });

    const { nameField } = getParts(instance);

    expect(nameField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    const { nameField } = getParts(instance);

    extensionBridge.init();
    nameField.props.onChange('foo');
    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo'
    });
  });

  it('sets error if name not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameValidationWrapper } = getParts(instance);
    expect(nameValidationWrapper.props.error).toBeDefined();
  });
});
