import TestUtils from 'react-addons-test-utils';

import RegisteredUser from '../registeredUser';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(RegisteredUser);

describe('registered user view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        dataElement: 'foo'
      }
    });

    const { dataElementField } = instance.refs;

    expect(dataElementField.props.value).toBe('foo');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { dataElementField } = instance.refs;

    dataElementField.props.onChange('foo');

    expect(extensionBridge.getConfig()).toEqual({
      dataElement: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementWrapper } = instance.refs;

    expect(dataElementWrapper.props.error).toEqual(jasmine.any(String));
  });
});
