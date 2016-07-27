import { mount } from 'enzyme';
import Variable from '../variable';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

const getReactComponents = (wrapper) => {
  const pathField = wrapper.find(Textfield).node;
  const pathWrapper = wrapper.find(ValidationWrapper).node;

  return {
    pathField,
    pathWrapper
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

    const { pathField } = getReactComponents(instance);

    expect(pathField.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pathField } = getReactComponents(instance);

    pathField.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      path: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { pathWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(pathWrapper.props.error).toEqual(jasmine.any(String));
  });
});
