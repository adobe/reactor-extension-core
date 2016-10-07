import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import DataElement from '../dataElement';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const fields = wrapper.find(Field);
  const nameField = fields.filterWhere(n => n.prop('name') === 'name');
  const nameTextfield = nameField.find(Textfield).node;
  const nameErrorTip = nameField.find(ErrorTip).node;
  const valueField = fields.filterWhere(n => n.prop('name') === 'value');
  const valueTextfield = valueField.find(Textfield).node;
  const valueErrorTip = valueField.find(ErrorTip).node;
  const valueRegexSwitch = wrapper.find(Switch).node;

  return {
    nameTextfield,
    nameErrorTip,
    valueTextfield,
    valueRegexSwitch,
    valueErrorTip
  };
};

describe('data element view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(DataElement, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        value: 'bar',
        valueIsRegex: true
      }
    });

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    expect(nameTextfield.props.value).toBe('foo');
    expect(valueTextfield.props.value).toBe('bar');
    expect(valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameTextfield, valueTextfield, valueRegexSwitch } = getReactComponents(instance);

    nameTextfield.props.onChange('foo');
    valueTextfield.props.onChange('bar');
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

    const { nameErrorTip, valueErrorTip } = getReactComponents(instance);

    expect(nameErrorTip).toBeDefined();
    expect(valueErrorTip).toBeDefined();
  });
});
