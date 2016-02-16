import TestUtils from 'react-addons-test-utils';

import QueryParameter from '../queryParameter';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(QueryParameter);

describe('query parameter view', () => {
  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox } = instance.refs;

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameField, caseInsensitiveCheckbox } = instance.refs;

    expect(nameField.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField, caseInsensitiveCheckbox } = instance.refs;

    nameField.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo',
      caseInsensitive: false
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { nameWrapper } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
  });
});
