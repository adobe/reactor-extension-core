import Cookie from '../cookie';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('cookie view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Cookie, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo'
      }
    });

    const { nameField } = instance.refs;

    expect(nameField.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField } = instance.refs;
    nameField.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
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
