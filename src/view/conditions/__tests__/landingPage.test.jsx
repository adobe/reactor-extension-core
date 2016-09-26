import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import LandingPage from '../landingPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import RegexToggle from '../../components/regexToggle';

const getReactComponents = (wrapper) => {
  const pageField = wrapper.find(Textfield).node;
  const valueRegexToggle = wrapper.find(RegexToggle).node;
  const pageWrapper = wrapper.find(ValidationWrapper).node;

  return {
    pageField,
    valueRegexToggle,
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

    const { pageField, valueRegexToggle } = getReactComponents(instance);

    expect(pageField.props.value).toBe('foo');
    expect(valueRegexToggle.props.page.input.value).toBe('foo');
    expect(valueRegexToggle.props.pageIsRegex.input.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pageField, valueRegexToggle } = getReactComponents(instance);

    pageField.props.onChange('foo');
    valueRegexToggle.props.pageIsRegex.input.onChange(true);

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
