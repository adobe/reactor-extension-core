import TestUtils from 'react-addons-test-utils';

import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import TrafficSource from '../trafficSource';

const { instance, extensionBridge } = setUpConnectedForm(TrafficSource);

describe('traffic source view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    const { sourceField, valueRegexToggle } = instance.refs;

    expect(sourceField.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe('foo');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { sourceField, valueRegexToggle } = instance.refs;

    sourceField.props.onChange('foo');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getConfig()).toEqual({
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
