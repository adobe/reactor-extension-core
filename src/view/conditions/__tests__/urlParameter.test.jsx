import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import { ValidationWrapper } from '@reactor/react-components';

import CoralField from '../../components/coralField';
import URLParameter from '../urlParameter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'name').node;
  const valueField =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'value').node;
  const valueRegexSwitch = wrapper.find(Switch).node;
  const nameWrapper = wrapper.find(CoralField)
    .filterWhere(n => n.prop('name') === 'name').find(ValidationWrapper).node;
  const valueWrapper = wrapper.find(CoralField)
    .filterWhere(n => n.prop('name') === 'value').find(ValidationWrapper).node;
  return {
    nameField,
    valueField,
    valueRegexSwitch,
    nameWrapper,
    valueWrapper
  };
};

describe('url parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(URLParameter, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameField, valueField, valueRegexSwitch } = getReactComponents(instance);

    expect(nameField.props.value).toBe('foo');
    expect(valueField.props.value).toBe('bar');
    expect(valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, valueField, valueRegexSwitch } = getReactComponents(instance);

    nameField.props.onChange('foo');
    valueField.props.onChange('bar');
    valueRegexSwitch.props.onChange({ target: { checked: true } });

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
