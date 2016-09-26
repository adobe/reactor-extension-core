import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import ElementExists from '../elementExists';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ElementSelector from '../components/elementSelector';

const getReactComponents = (wrapper) => {
  const elementSelectorTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'elementSelector').node;
  const elementSelectorWrapper = wrapper.find(ElementSelector).find(ValidationWrapper).node;

  return {
    elementSelectorTextfield,
    elementSelectorWrapper
  };
};

describe('element exists view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(ElementExists, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { elementSelectorTextfield } = getReactComponents(instance);

    expect(elementSelectorTextfield.props.value).toBe('.foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { elementSelectorTextfield } = getReactComponents(instance);

    elementSelectorTextfield.props.onChange('.foo');

    const { elementSelector } = extensionBridge.getSettings();

    expect(elementSelector).toBe('.foo');
  });

  it('sets validation errors', () => {
    extensionBridge.init();

    const { elementSelectorWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(elementSelectorWrapper.props.error).toEqual(jasmine.any(String));
  });
});
