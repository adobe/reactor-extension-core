import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import TrafficSource from '../trafficSource';
import RegexToggle from '../../components/regexToggle';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const sourceField = wrapper.find(Textfield).node;
  const valueRegexToggle = wrapper.find(RegexToggle).node;
  const sourceWrapper = wrapper.find(ValidationWrapper).node;

  return {
    sourceField,
    valueRegexToggle,
    sourceWrapper
  };
};

describe('traffic source view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TrafficSource, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        source: 'foo',
        sourceIsRegex: true
      }
    });

    const { sourceField, valueRegexToggle } = getReactComponents(instance);

    expect(sourceField.props.value).toBe('foo');
    expect(valueRegexToggle.props.value).toBe('foo');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { sourceField, valueRegexToggle } = getReactComponents(instance);

    sourceField.props.onChange('foo');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { sourceWrapper } = getReactComponents(instance);

    expect(sourceWrapper.props.error).toEqual(jasmine.any(String));
  });
});
