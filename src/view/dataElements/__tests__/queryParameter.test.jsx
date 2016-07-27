import { mount } from 'enzyme';
import QueryParameter from '../queryParameter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

const getReactComponents = (wrapper) => {
  const nameField = wrapper.find(Textfield).node;
  const caseInsensitiveCheckbox = wrapper.find(Checkbox).node;
  const nameWrapper = wrapper.find(ValidationWrapper).node;

  return {
    nameField,
    caseInsensitiveCheckbox,
    nameWrapper
  };
};

describe('query parameter view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(QueryParameter, extensionBridge));
  });

  it('checks case insensitive checkbox by default', () => {
    extensionBridge.init();

    const { caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(caseInsensitiveCheckbox.props.checked).toBe(true);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        name: 'foo',
        caseInsensitive: false
      }
    });

    const { nameField, caseInsensitiveCheckbox } = getReactComponents(instance);

    expect(nameField.props.value).toBe('foo');
    expect(caseInsensitiveCheckbox.props.checked).toBe(false);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { nameField, caseInsensitiveCheckbox } = getReactComponents(instance);

    nameField.props.onChange('foo');
    caseInsensitiveCheckbox.props.onChange(false);

    expect(extensionBridge.getSettings()).toEqual({
      name: 'foo',
      caseInsensitive: false
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    const { nameWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(nameWrapper.props.error).toEqual(jasmine.any(String));
  });
});
