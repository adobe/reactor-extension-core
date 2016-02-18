import TestUtils from 'react-addons-test-utils';

import LoggedIn from '../loggedIn';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(LoggedIn);

describe('logged in view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo'
      }
    });

    const { dataElementField } = instance.refs;

    expect(dataElementField.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementField } = instance.refs;

    dataElementField.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
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
