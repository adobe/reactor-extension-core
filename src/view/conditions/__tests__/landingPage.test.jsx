import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import LandingPage from '../landingPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const pageTextfield = wrapper.find(Textfield).node;
  const pageRegexSwitch = wrapper.find(Switch).node;
  const pageErrorTip = wrapper.find(ErrorTip).node;

  return {
    pageTextfield,
    pageRegexSwitch,
    pageErrorTip
  };
};

describe('landing page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(LandingPage, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        page: 'foo',
        pageIsRegex: true
      }
    });

    const { pageTextfield, pageRegexSwitch } = getReactComponents(instance);

    expect(pageTextfield.props.value).toBe('foo');
    expect(pageRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pageTextfield, pageRegexSwitch } = getReactComponents(instance);

    pageTextfield.props.onChange('foo');
    pageRegexSwitch.props.onChange({ target: { checked: true } });

    expect(extensionBridge.getSettings()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pageErrorTip } = getReactComponents(instance);

    expect(pageErrorTip).toBeDefined();
  });
});
