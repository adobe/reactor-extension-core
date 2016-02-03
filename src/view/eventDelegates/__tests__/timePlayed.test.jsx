import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import TimePlayedProviderComponent, { TimePlayed, reducers as timePlayedEventReducers }
  from '../timePlayed';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementFilter from '../components/elementFilter';
import SpecificElements from '../components/specificElements';
import setUpComponent from '../../__tests__/helpers/setUpComponent';

let { instance, extensionBridge } =
  setUpComponent(TimePlayedProviderComponent, timePlayedEventReducers);

instance = TestUtils.findRenderedComponentWithType(instance, TimePlayed);

describe('time played view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        elementSelector: '.foo',
        amount: 55,
        unit: 'percent',
        bubbleStop: true
      }
    });

    const { amountField, unitSelect, elementFilter, advancedEventOptions } = instance.refs;

    expect(amountField.props.value).toBe(55);
    expect(unitSelect.props.value).toBe('percent');
    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { amountField, elementFilter, advancedEventOptions } = instance.refs;

    amountField.props.onChange(45);
    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { amount, unit, elementSelector, bubbleStop } = extensionBridge.getConfig();
    expect(amount).toBe(45);
    expect(unit).toBe('second');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { amountField, elementFilter } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(amountField.props.error).toEqual(jasmine.any(String));
    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
