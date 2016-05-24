import DataElement from '../dataElement';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
    instance = getFormInstance(DataElement, extensionBridge);
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element button', () => {
    const { nameField, nameButton } = instance.refs;

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    nameButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(nameField.props.value).toBe('foo');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
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

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, valueRegexToggle } = instance.refs;

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
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
