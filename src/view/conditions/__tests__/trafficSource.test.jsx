import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import TrafficSource from '../trafficSource';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const sourceTextfield = wrapper.find(Textfield).node;
  const valueRegexSwitch = wrapper.find(Switch).node;
  const sourceErrorTip = wrapper.find(ErrorTip).node;

  return {
    sourceTextfield,
    valueRegexSwitch,
    sourceErrorTip
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

    const { sourceTextfield, valueRegexSwitch } = getReactComponents(instance);

    expect(sourceTextfield.props.value).toBe('foo');
    expect(valueRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { sourceTextfield, valueRegexSwitch } = getReactComponents(instance);

    sourceTextfield.props.onChange('foo');
    valueRegexSwitch.props.onChange({ target: { checked: true } });

    expect(extensionBridge.getSettings()).toEqual({
      source: 'foo',
      sourceIsRegex: true
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorTip } = getReactComponents(instance);

    expect(sourceErrorTip).toBeDefined();
  });
});
