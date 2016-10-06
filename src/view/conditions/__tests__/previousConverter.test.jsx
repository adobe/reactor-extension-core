import { mount } from 'enzyme';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import PreviousConverter from '../previousConverter';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const dataElementField = wrapper.find(Textfield).node;
  const dataElementButton = wrapper.find(DataElementSelectorButton).node;
  const dataElementWrapper = wrapper.find(ValidationWrapper).node;

  return {
    dataElementField,
    dataElementButton,
    dataElementWrapper
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

    const { dataElementField } = getReactComponents(instance);

    expect(dataElementField.props.value).toBe('foo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { dataElementField } = getReactComponents(instance);

    dataElementField.props.onChange('foo');

    expect(extensionBridge.getSettings()).toEqual({
      dataElement: 'foo'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { dataElementWrapper } = getReactComponents(instance);

    expect(dataElementWrapper.props.error).toEqual(jasmine.any(String));
  });
});
