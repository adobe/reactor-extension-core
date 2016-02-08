import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import Click, { reducers } from '../click';

const { instance, extensionBridge } = setUpComponent(Click, reducers);

describe('click view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        delayLinkActivation: true,
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { delayLinkActivationCheckbox, elementFilter, advancedEventOptions } = instance.refs;

    expect(delayLinkActivationCheckbox.props.value).toBe(true);
    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { delayLinkActivationCheckbox, elementFilter, advancedEventOptions } = instance.refs;

    delayLinkActivationCheckbox.props.onChange(true);
    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { delayLinkActivation, elementSelector, bubbleStop } = extensionBridge.getConfig();

    expect(delayLinkActivation).toBe(true);
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementFilter } = instance.refs;

    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
