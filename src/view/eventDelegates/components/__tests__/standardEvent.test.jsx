import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';
import StandardEventProviderComponent, {reducers as standardEventReducers }
  from '../../components/standardEvent';
import ElementSelectorField from '../elementSelectorField';
import ElementPropertiesEditor from '../elementPropertiesEditor';
import AdvancedEventOptions from '../advancedEventOptions';
import ElementFilter from '../elementFilter';
import SpecificElements from '../specificElements';
import setUpComponent from '../../../__tests__/helpers/setUpComponent';
import testElementFilter from './elementFilter.test';
import testAdvancedOptions from './advancedEventOptions.test';
import testElementPropertiesEditor from './elementPropertiesEditor.test';

const { instance, extensionBridge } =
  setUpComponent(StandardEventProviderComponent, standardEventReducers);
const getParts = (instance) => {
  return {
    elementFilterComponent:
      TestUtils.findRenderedComponentWithType(instance, ElementFilter),
    specificElementsComponent:
      TestUtils.scryRenderedComponentsWithType(instance, SpecificElements)[0],
    elementSelectorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementSelectorField)[0],
    elementPropertiesEditorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementPropertiesEditor)[0],
    advancedEventOptionsComponent:
      TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions)
  };
};

describe('standard event view', () => {
  testElementFilter(instance, getParts, extensionBridge);
  testAdvancedOptions(instance, getParts, extensionBridge);
  testElementPropertiesEditor(instance, getParts, extensionBridge);
});
