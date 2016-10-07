import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Variable from '../variable';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const pathTextfield = wrapper.find(Textfield).node;
  const pathErrorTip = wrapper.find(ErrorTip).node;

  return {
    pathTextfield,
    pathErrorTip
  };
};

describe('variable view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Variable, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        path: 'foo'
      }
    });

    const { pathTextfield } = getReactComponents(instance);

    expect(pathTextfield.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pathTextfield } = getReactComponents(instance);

    pathTextfield.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      path: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pathErrorTip } = getReactComponents(instance);

    expect(pathErrorTip).toBeDefined();
  });
});
