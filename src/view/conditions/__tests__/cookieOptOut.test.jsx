import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import CookieOptOut from '../cookieOptOut';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const acceptCookiesCheckbox = wrapper.find(Checkbox).node;

  return {
    acceptCookiesCheckbox
  };
};

describe('cookie out-out view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(CookieOptOut, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        acceptsCookies: true
      }
    });

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    expect(acceptCookiesCheckbox.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { acceptCookiesCheckbox } = getReactComponents(instance);

    acceptCookiesCheckbox.props.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      acceptsCookies: true
    });
  });
});
