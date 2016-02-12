import TestUtils from 'react-addons-test-utils';

import Cookie from '../cookie';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';


const { instance, extensionBridge } = setUpConnectedForm(Cookie);

describe('cookie view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        name: 'foo'
      }
    });

    const { nameField } = instance.refs;

    expect(nameField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { nameField } = instance.refs;
    nameField.props.onChange('foo');

    expect(extensionBridge.getConfig()).toEqual({
      name: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper } = instance.refs;

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
  });
});
