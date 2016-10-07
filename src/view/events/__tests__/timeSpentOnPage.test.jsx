import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import TimeSpentOnPage from '../timeSpentOnPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const timeOnPageTextfield = wrapper.find(Textfield).node;
  const timeOnPageErrorTip = wrapper.find(ErrorTip).node;

  return {
    timeOnPageTextfield,
    timeOnPageErrorTip
  };
};

describe('time spent on page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TimeSpentOnPage, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    const { timeOnPageTextfield } = getReactComponents(instance);

    expect(timeOnPageTextfield.props.value).toBe(44);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { timeOnPageTextfield } = getReactComponents(instance);
    timeOnPageTextfield.props.onChange('55');

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageErrorTip } = getReactComponents(instance);

    expect(timeOnPageErrorTip).toBeDefined();
  });

  it('sets error if timeOnPage value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageTextfield, timeOnPageErrorTip } = getReactComponents(instance);

    timeOnPageTextfield.props.onChange('12.abc');

    expect(timeOnPageErrorTip).toBeDefined();
  });
});
