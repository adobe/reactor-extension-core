import PageViews from '../pageViews';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('page views view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(PageViews, extensionBridge);
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = instance.refs;

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        count: 100,
        duration: 'session'
      }
    });

    const { operatorField, countField, lifetimeRadio, sessionRadio } = instance.refs;

    expect(operatorField.props.value).toBe('=');
    expect(countField.props.value).toBe(100);
    expect(lifetimeRadio.props.checked).toBe(false);
    expect(sessionRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorField, countField, sessionRadio } = instance.refs;

    operatorField.props.onChange('=');
    countField.props.onChange(100);
    sessionRadio.props.onChange('session');

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100,
      duration: 'session'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countWrapper } = instance.refs;

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countField, countWrapper } = instance.refs;

    countField.props.onChange('12.abc');

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });
});
