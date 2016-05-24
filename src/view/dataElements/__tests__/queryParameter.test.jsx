import QueryParameter from '../queryParameter';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('query parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(QueryParameter, extensionBridge);
  });

  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox } = instance.refs;

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameField, caseInsensitiveCheckbox } = instance.refs;

    expect(nameField.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, caseInsensitiveCheckbox } = instance.refs;

    nameField.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings()).toEqual({
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
