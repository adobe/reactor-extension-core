import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Button from '@coralui/react-coral/lib/Button';

import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import ElementSelector, { formConfig } from '../elementSelector';
import extensionViewReduxForm from '../../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const textfield = wrapper.find(Textfield).node;
  const button = wrapper.find(Button).node;
  const validationWrapper = wrapper.find(ValidationWrapper).node;

  return {
    textfield,
    button,
    validationWrapper
  };
};

describe('elementSelector', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ElementSelector);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        elementSelector: 'foo'
      }
    });

    const { textfield } = getReactComponents(instance);

    expect(textfield.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { textfield } = getReactComponents(instance);

    textfield.props.onChange('some prop set');

    expect(extensionBridge.getSettings()).toEqual({
      elementSelector: 'some prop set'
    });
  });

  it('sets error if element selector field is empty', () => {
    extensionBridge.init();
    const { validationWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(validationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
