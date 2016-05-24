import TimeOnSite from '../timeOnSite';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('time on site view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(TimeOnSite, extensionBridge);
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
        minutes: 100
      }
    });

    const { operatorField, minutesField } = instance.refs;

    expect(operatorField.props.value).toBe('=');
    expect(minutesField.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorField, minutesField } = instance.refs;

    operatorField.props.onChange('=');
    minutesField.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesWrapper } = instance.refs;

    expect(minutesWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesField, minutesWrapper } = instance.refs;

    minutesField.props.onChange('12.abc');

    expect(minutesWrapper.props.error).toEqual(jasmine.any(String));
  });
});
