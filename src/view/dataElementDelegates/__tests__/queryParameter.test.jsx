import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import QueryParameter, { reducers } from '../queryParameter';
import ValidationWrapper from '../../components/validationWrapper';

const {instance, extensionBridge} = setupComponent(QueryParameter, reducers);
const getParts = () => {
  return {
    nameField: TestUtils.findRenderedComponentWithType(instance, Coral.Textfield),
    nameValidationWrapper: TestUtils.findRenderedComponentWithType(instance, ValidationWrapper),
    caseInsensitiveCheckbox: TestUtils.findRenderedComponentWithType(instance, Coral.Checkbox)
  };
};

describe('query param view', () => {
  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox} = getParts();

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameField, caseInsensitiveCheckbox} = getParts();

    expect(nameField.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField, caseInsensitiveCheckbox} = getParts();

    nameField.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo',
      caseInsensitive: false
    });
  });

  it('sets error if name not provided', () => {
    extensionBridge.init();

    const { nameValidationWrapper } = getParts();

    extensionBridge.validate();

    expect(nameValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
