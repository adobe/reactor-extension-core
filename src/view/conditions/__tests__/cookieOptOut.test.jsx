import CookieOptOut from '../cookieOptOut';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('cookie out-out view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(CookieOptOut, extensionBridge);
  });

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
