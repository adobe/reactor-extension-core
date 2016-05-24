import ElementExists from '../elementExists';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('element exists view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(ElementExists, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { specificElements } = instance.refs;

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { specificElements } = instance.refs;

    specificElements.props.fields.elementSelector.onChange('.foo');

    const { elementSelector } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { specificElements } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
