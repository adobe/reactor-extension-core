import TestUtils from 'react-addons-test-utils';

import Cookie from '../cookie';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Cookie);

describe('cookie view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameField, valueField, valueRegexToggle } = instance.refs;

    expect(nameField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(valueRegexToggle.props.value).toBe('bar');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, valueRegexToggle } = instance.refs;

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper, valueWrapper } = instance.refs;

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
    expect(valueWrapper.props.error).toEqual(jasmine.any(String));
  });
});
