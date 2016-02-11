import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import TimeSpentOnPage from '../timeSpentOnPage';

const { instance, extensionBridge } = setUpConnectedForm(TimeSpentOnPage);

describe('time spent on page view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        timeOnPage: 44
      }
    });

    const { timeOnPageField } = instance.refs;

    expect(timeOnPageField.props.value).toBe(44);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { timeOnPageField } = instance.refs;
    timeOnPageField.props.onChange('55');

    expect(extensionBridge.getConfig()).toEqual({
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
