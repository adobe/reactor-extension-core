import LandingPage from '../landingPage';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('landing page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(LandingPage, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    const { pageField, valueRegexToggle } = instance.refs;

    expect(pageField.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe('foo');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pageField, valueRegexToggle } = instance.refs;

    pageField.props.onChange('foo');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pageWrapper } = instance.refs;

    expect(pageWrapper.props.error).toEqual(jasmine.any(String));
  });
});
