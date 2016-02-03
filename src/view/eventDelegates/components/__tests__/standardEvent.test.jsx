import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';
import StandardEventProvider, { StandardEvent, reducers as standardEventReducers } from '../../components/standardEvent';
import setUpComponent from '../../../__tests__/helpers/setUpComponent';
import testElementFilter from './elementFilter.test';
import testAdvancedEventOptions from './advancedEventOptions.test';

let { instance, extensionBridge } = setUpComponent(StandardEventProvider, standardEventReducers);
instance = TestUtils.findRenderedComponentWithType(instance, StandardEvent);

describe('standard event view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const { elementFilter, advancedEventOptions } = instance.refs;

    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { elementFilter, advancedEventOptions } = instance.refs;

    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { elementSelector, bubbleStop } = extensionBridge.getConfig();
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementFilter } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
