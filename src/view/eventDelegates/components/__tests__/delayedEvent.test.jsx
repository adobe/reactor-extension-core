import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';
import DelayedEventProviderComponent, {reducers as delayedEventReducers }
  from '../../components/delayedEvent';
import ElementSelectorField from '../elementSelectorField';
import ElementPropertiesEditor from '../elementPropertiesEditor';
import AdvancedEventOptions from '../advancedEventOptions';
import ElementFilter from '../elementFilter';
import DelayType from '../delayType';
import setUpComponent from '../../../__tests__/helpers/setUpComponent';
import testElementFilter from './elementFilter.test';
import testAdvancedOptions from './advancedEventOptions.test';
import testElementPropertiesEditor from './elementPropertiesEditor.test';
import testDelayType from './delayType.test';

const { instance, extensionBridge } = setUpComponent(DelayedEventProviderComponent, delayedEventReducers);
const getParts = (instance) => {
  return {
    elementFilterComponent:
      TestUtils.findRenderedComponentWithType(instance, ElementFilter),
    elementSelectorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementSelectorField)[0],
    elementPropertiesEditorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementPropertiesEditor)[0],
    advancedEventOptionsComponent:
      TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions),
    delayTypeComponent:
      TestUtils.findRenderedComponentWithType(instance, DelayType)
  };
};

describe('delayed event view', () => {
  testElementFilter(instance, getParts, extensionBridge);
  testAdvancedOptions(instance, getParts, extensionBridge);
  testElementPropertiesEditor(instance, getParts, extensionBridge);
  testDelayType(instance, getParts, extensionBridge);
});
