import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import { ValidationWrapper } from '@reactor/react-components';

import LandingPage from '../landingPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const pageField = wrapper.find(Textfield).node;
  const pageRegexSwitch = wrapper.find(Switch).node;
  const pageWrapper = wrapper.find(ValidationWrapper).node;

  return {
    pageField,
    pageRegexSwitch,
    pageWrapper
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

    const { pageField, pageRegexSwitch } = getReactComponents(instance);

    expect(pageField.props.value).toBe('foo');
    expect(pageRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pageField, pageRegexSwitch } = getReactComponents(instance);

    pageField.props.onChange('foo');
    pageRegexSwitch.props.onChange({ target: { checked: true }});

    expect(extensionBridge.getSettings()).toEqual({
      page: 'foo',
      pageIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pageWrapper } = getReactComponents(instance);

    expect(pageWrapper.props.error).toEqual(jasmine.any(String));
  });
});
