import PageViews from '../pageViews';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import { mount } from 'enzyme';
import ComparisonOperatorField from '../components/comparisonOperatorField';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Radio from '@coralui/react-coral/lib/Radio';
import { ValidationWrapper } from '@reactor/react-components';

const getReactComponents = (wrapper) => {
  const lifetimeRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'lifetime').node;
  const sessionRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'session').node;
  const operatorField = wrapper.find(ComparisonOperatorField).node;
  const countField = wrapper.find(Textfield).node;
  const countWrapper = wrapper.find(ValidationWrapper).node;

  return {
    lifetimeRadio,
    sessionRadio,
    operatorField,
    countField,
    countWrapper
  };
};

describe('page views view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(PageViews, extensionBridge));
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
        count: 100,
        duration: 'session'
      }
    });

    const { operatorField, countField, lifetimeRadio, sessionRadio } = getReactComponents(instance);

    expect(operatorField.props.value).toBe('=');
    expect(countField.props.value).toBe(100);
    expect(lifetimeRadio.props.checked).toBe(false);
    expect(sessionRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatorField, countField, sessionRadio } = getReactComponents(instance);

    operatorField.props.onChange('=');
    countField.props.onChange(100);
    sessionRadio.props.onChange('session');

    expect(extensionBridge.getSettings()).toEqual({
      operator: '=',
      count: 100,
      duration: 'session'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countWrapper } = getReactComponents(instance);

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if count value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { countField, countWrapper } = getReactComponents(instance);

    countField.props.onChange('12.abc');

    expect(countWrapper.props.error).toEqual(jasmine.any(String));
  });
});
