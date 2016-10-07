import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Select from '@coralui/react-coral/lib/Select';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import TimeOnSite from '../timeOnSite';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const operatorSelect = wrapper.find(Select).node;
  const minutesTextfield = wrapper.find(Textfield).node;
  const minutesErrorTip = wrapper.find(ErrorTip).node;

  return {
    operatorSelect,
    minutesTextfield,
    minutesErrorTip
  };
};

describe('time on site view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TimeOnSite, extensionBridge));
  });

  it('sets operator to greater than by default', () => {
    extensionBridge.init();

    const { operatorSelect } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        minutes: 100
      }
    });

    const { operatorSelect, minutesTextfield } = getReactComponents(instance);

    expect(operatorSelect.props.value).toBe('=');
    expect(minutesTextfield.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorSelect, minutesTextfield } = getReactComponents(instance);

    operatorSelect.props.onChange({ value: '=' });
    minutesTextfield.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesErrorTip } = getReactComponents(instance);

    expect(minutesErrorTip).toBeDefined();
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesTextfield, minutesErrorTip } = getReactComponents(instance);

    minutesTextfield.props.onChange('12.abc');

    expect(minutesErrorTip).toBeDefined();
  });
});
