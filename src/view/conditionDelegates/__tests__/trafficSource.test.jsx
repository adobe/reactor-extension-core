import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import TrafficSource from '../trafficSource';

const { instance, extensionBridge } = setUpConnectedForm(TrafficSource);

describe('traffic source view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    const { sourceField, valueRegexToggle } = instance.refs;

    expect(sourceField.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe('foo');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { sourceField, valueRegexToggle } = instance.refs;

    sourceField.props.onChange('foo');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { sourceWrapper } = instance.refs;

    expect(sourceWrapper.props.error).toEqual(jasmine.any(String));
  });
});
