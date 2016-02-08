import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Cookie from '../cookie';
import ValidationWrapper from '../../components/validationWrapper';

const { instance, extensionBridge } = setUpConnectedForm(Cookie);
const getParts = () => {
  return {
    nameField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    nameValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper)
  };
};

describe('cookie view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo'
      }
    });

    const { nameField } = getParts();

    expect(nameField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField } = getParts();
    nameField.props.onChange('foo');

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameValidationWrapper } = getParts();

    expect(nameValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
