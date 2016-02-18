import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import CookieOptOut from '../cookieOptOut';

const { instance, extensionBridge } = setUpConnectedForm(CookieOptOut);

describe('cookie out-out view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        acceptsCookies: true
      }
    });

    const { acceptCookiesCheckbox } = instance.refs;

    expect(acceptCookiesCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { acceptCookiesCheckbox } = instance.refs;

    acceptCookiesCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      acceptsCookies: true
    });
  });
});
