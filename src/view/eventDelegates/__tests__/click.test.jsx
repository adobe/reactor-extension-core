import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import ClickProviderComponent, {Click, reducers as clickEventReducers } from '../click';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementFilter from '../components/elementFilter';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import testElementFilter from '../components/__tests__/elementFilter.test';
import testAdvancedOptions from '../components/__tests__/advancedEventOptions.test';
import testElementPropertiesEditor from '../components/__tests__/elementPropertiesEditor.test';

const { instance, extensionBridge } = setUpComponent(ClickProviderComponent, clickEventReducers);
const getParts = (instance) => {
  return {
    elementFilterComponent:
      TestUtils.findRenderedComponentWithType(instance, ElementFilter),
    elementSelectorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementSelectorField)[0],
    elementPropertiesEditorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementPropertiesEditor)[0],
    clickComponent:
      TestUtils.findRenderedComponentWithType(instance, Click),
    advancedEventOptionsComponent:
      TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions)
  };
};

describe('click view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        delayLinkActivation: true
      }
    });

    const { clickComponent } = getParts(instance);
    expect(clickComponent.refs.delayLinkActivationCheckbox.props.checked).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { clickComponent } = getParts(instance);
    clickComponent.refs.delayLinkActivationCheckbox.props.onChange(true);

    expect(extensionBridge.getConfig()).toEqual({
      delayLinkActivation: true
    });
  });

  testElementFilter(instance, getParts, extensionBridge);
  testAdvancedOptions(instance, getParts, extensionBridge);
  testElementPropertiesEditor(instance, getParts, extensionBridge);
});
