import { mount } from 'enzyme';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Textfield from '@coralui/react-coral/lib/Textfield';
import PreviousConverter from '../previousConverter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const dataElementTextfield = wrapper.find(Textfield).node;
  const dataElementErrorTip = wrapper.find(ErrorTip).node;

  return {
    dataElementTextfield,
    dataElementErrorTip
  };
};

describe('previous converter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(PreviousConverter, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        dataElement: 'foo'
      }
    });

    const { dataElementTextfield } = getReactComponents(instance);

    expect(dataElementTextfield.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementTextfield } = getReactComponents(instance);

    dataElementTextfield.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementErrorTip } = getReactComponents(instance);

    expect(dataElementErrorTip).toBeDefined();
  });
});
