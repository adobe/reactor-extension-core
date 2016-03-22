import RegisteredUser from '../registeredUser';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('registered user view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    extensionBridge.openDataElementSelector = jasmine.createSpy();
    window.extensionBridge = extensionBridge;
    instance = getFormInstance(RegisteredUser, extensionBridge);
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element field', () => {
    const { dataElementField } = instance.refs;

    dataElementField.props.onOpenSelector();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
  });

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
