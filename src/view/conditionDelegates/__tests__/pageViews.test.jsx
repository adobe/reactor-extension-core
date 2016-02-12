import TestUtils from 'react-addons-test-utils';

import PageViews from '../pageViews';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(PageViews);

describe('page views view', () => {
  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorField } = instance.refs;

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
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

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatorField, countField, sessionRadio } = instance.refs;

    operatorField.props.onChange('=');
    countField.props.onChange(100);
    sessionRadio.props.onChange('session');

    expect(extensionBridge.getConfig()).toEqual({
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
