import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import ErrorIcon from '../../components/errorIcon';
import BlurProviderComponent, {Blur, reducers as blurEventReducers } from '../blur';
import ElementSelectorField from '../components/elementSelectorField';
import ElementPropertiesEditor from '../components/elementPropertiesEditor';
import AdvancedEventOptions from '../components/advancedEventOptions';
import ElementFilter from '../components/elementFilter';
import setupComponent from '../../__tests__/helpers/setupComponent';
import testElementFilter from '../components/__tests__/elementFilter.test';
import testAdvancedOptions from '../components/__tests__/advancedEventOptions.test';
import testElementPropertiesEditor from '../components/__tests__/elementPropertiesEditor.test';

const { instance, extensionBridge } = setupComponent(BlurProviderComponent, blurEventReducers);
const getParts = (instance) => {
  const errorIcons = TestUtils.scryRenderedComponentsWithType(instance, ErrorIcon);

  return {
    elementFilterComponent:
      TestUtils.findRenderedComponentWithType(instance, ElementFilter),
    elementSelectorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementSelectorField)[0],
    elementPropertiesEditorComponent:
      TestUtils.scryRenderedComponentsWithType(instance, ElementPropertiesEditor)[0],
    advancedEventOptionsComponent:
      TestUtils.findRenderedComponentWithType(instance, AdvancedEventOptions),
    errorIcon: errorIcons.length ? errorIcons[0] : null
  };
};

describe('blur view', () => {
  testElementFilter(instance, getParts, extensionBridge);
  testAdvancedOptions(instance, getParts, extensionBridge);
  testElementPropertiesEditor(instance, getParts, extensionBridge);
});
