import TestUtils from 'react-addons-test-utils';

import LandingPage from '../landingPage';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(LandingPage);

describe('landing page view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    const { pageField, valueRegexToggle } = instance.refs;

    expect(pageField.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe('foo');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { pageField, valueRegexToggle } = instance.refs;

    pageField.props.onChange('foo');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
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
