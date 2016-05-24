import TimeSpentOnPage from '../timeSpentOnPage';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('time spent on page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(TimeSpentOnPage, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    const { timeOnPageField } = instance.refs;

    expect(timeOnPageField.props.value).toBe(44);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { timeOnPageField } = instance.refs;
    timeOnPageField.props.onChange('55');

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageWrapper } = instance.refs;

    expect(timeOnPageWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if timeOnPage value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageField, timeOnPageWrapper } = instance.refs;

    timeOnPageField.props.onChange('12.abc');

    expect(timeOnPageWrapper.props.error).toEqual(jasmine.any(String));
  });
});
