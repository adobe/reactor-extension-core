import { mount } from 'enzyme';
import VariableSet from '../variable';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import RegexToggle from '../../components/regexToggle';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'name').node;
  const valueField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'value').node;
  const valueRegexToggle = wrapper.find(RegexToggle).node;
  const nameWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'name').node;
  const valueWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'value').node;

  return {
    nameField,
    valueField,
    valueRegexToggle,
    nameWrapper,
    valueWrapper
  };
};

describe('variable set view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(VariableSet, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameField, valueField, valueRegexToggle } = getReactComponents(instance);

    expect(nameField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(valueRegexToggle.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, valueRegexToggle } = getReactComponents(instance);

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    valueRegexToggle.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      value: 'bar',
      valueIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper, valueWrapper } = getReactComponents(instance);

    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
    expect(valueWrapper.props.error).toEqual(jasmine.any(String));
  });
});
