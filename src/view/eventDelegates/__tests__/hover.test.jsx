import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import HoverProviderComponent, { Hover, reducers } from '../hover';

let { instance, extensionBridge } = setUpComponent(HoverProviderComponent, reducers);

instance = TestUtils.findRenderedComponentWithType(instance, Hover);

describe('hover view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        delay: 100,
        bubbleStop: true
      }
    });

    const { specificElements, delayType, advancedEventOptions } = instance.refs;

    expect(specificElements.props.fields.elementSelector.value).toBe('.foo');
    expect(delayType.props.fields.delay.value).toBe(100);
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { specificElements, delayType, advancedEventOptions } = instance.refs;

    specificElements.props.fields.elementSelector.onChange('.foo');
    delayType.props.fields.delayType.onChange('delay');
    delayType.props.fields.delay.onChange(100);
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { elementSelector, delay, bubbleStop } = extensionBridge.getConfig();

    expect(elementSelector).toBe('.foo');
    expect(delay).toBe(100);
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { specificElements, delayType } = instance.refs;

    delayType.props.fields.delayType.onChange('delay');

    expect(extensionBridge.validate()).toBe(false);

    expect(delayType.props.fields.delay.error).toEqual(jasmine.any(String));
    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
