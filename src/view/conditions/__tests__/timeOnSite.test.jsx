import { mount } from 'enzyme';
import TimeOnSite from '../timeOnSite';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const getReactComponents = (wrapper) => {
  const operatorField = wrapper.find(ComparisonOperatorField).node;
  const minutesField = wrapper.find(Textfield).node;
  const minutesWrapper = wrapper.find(ValidationWrapper).node;

  return {
    operatorField,
    minutesField,
    minutesWrapper
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

    const { operatorField } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operator: '=',
        minutes: 100
      }
    });

    const { operatorField, minutesField } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('=');
    expect(minutesField.props.value).toBe(100);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorField, minutesField } = getReactComponents(instance);

    operatorField.props.onChange('=');
    minutesField.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      minutes: 100
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesWrapper } = getReactComponents(instance);

    expect(minutesWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { minutesField, minutesWrapper } = getReactComponents(instance);

    minutesField.props.onChange('12.abc');

    expect(minutesWrapper.props.error).toEqual(jasmine.any(String));
  });
});
