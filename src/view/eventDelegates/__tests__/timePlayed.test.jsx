import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import TimePlayedProviderComponent, {TimePlayed, reducers as timePlayedEventReducers }
  from '../timePlayed';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementFilter from '../components/elementFilter';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import testElementFilter from '../components/__tests__/elementFilter.test';
import testAdvancedOptions from '../components/__tests__/advancedEventOptions.test';
import testElementPropertiesEditor from '../components/__tests__/elementPropertiesEditor.test';

const { instance, extensionBridge } =
  setUpComponent(TimePlayedProviderComponent, timePlayedEventReducers);
const getParts = (instance) => {
  return {
    elementFilterComponent:
      TestUtils.findRenderedComponentWithType(instance, ElementFilter),
    elementSelectorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementSelectorField)[0],
    elementPropertiesEditorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementPropertiesEditor)[0],
    timePlayedComponent:
      TestUtils.findRenderedComponentWithType(instance, TimePlayed),
    advancedEventOptionsComponent:
      TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions)
  };
};

describe('click view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        amount: 55,
        unit: 'percent'
      }
    });

    const { timePlayedComponent } = getParts(instance);
    expect(timePlayedComponent.refs.amountField.props.value).toBe(55);
    expect(timePlayedComponent.refs.unitSelect.props.value).toBe('percent');
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { timePlayedComponent } = getParts(instance);
    timePlayedComponent.refs.amountField.props.onChange(45);

    const { amount, unit } = extensionBridge.getConfig();
    expect({ amount, unit }).toEqual({
      amount: 45,
      unit: 'second'
    });
  });

  it('sets error if element amount field is empty', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { timePlayedComponent } = getParts(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(timePlayedComponent.refs.amountField.props.error)
      .toEqual(jasmine.any(String));
  });

  testElementFilter(instance, getParts, extensionBridge);
  testAdvancedOptions(instance, getParts, extensionBridge);
  testElementPropertiesEditor(instance, getParts, extensionBridge);
});
