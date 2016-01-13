import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import Click, { reducers as clickEventReducers } from '../click';
import ElementFilter from '../components/elementFilter';
import testElementFilter from '../components/__tests__/elementFilter.test';

const { instance, extensionBridge } = setupComponent(Click, clickEventReducers);
const getParts = component => {
  return {
    delayLinkActivationCheckbox:
      TestUtils.scryRenderedComponentsWithType(component, Coral.Checkbox)[0],
    elementFilter: TestUtils.findRenderedComponentWithType(component, ElementFilter)
  };
};

describe('click view', () => {
  describe('delay link activation checkbox', () => {
    it('is checked when delayLinkActivation=true', () => {
      extensionBridge.init({
        config: {
          delayLinkActivation: true
        }
      });

      const { delayLinkActivationCheckbox } = getParts(instance);
      expect(delayLinkActivationCheckbox.props.checked).toBe(true);
    });
  });

  const { elementFilter } = getParts(instance);
  testElementFilter(elementFilter, extensionBridge);
});
