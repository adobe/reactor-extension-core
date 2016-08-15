import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ElementFilter from '../components/elementFilter';
import AdvancedEventOptions from '../components/advancedEventOptions';

const getReactComponents = (wrapper) => {
  const typeField = wrapper.find(Textfield).node;
  const typeWrapper = wrapper.find(ValidationWrapper).node;
  const elementFilter = wrapper.find(ElementFilter).node;
  const advancedEventOptions = wrapper.find(AdvancedEventOptions).node;

  return {
    typeField,
    typeWrapper,
    elementFilter,
    advancedEventOptions
  };
};

describe('custom event view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'bar',
        elementSelector: '.foo',
        bubbleStop: true
      }
    });

    const {
      typeField,
      elementFilter,
      advancedEventOptions
    } = getReactComponents(instance);

    expect(typeField.props.value).toBe('bar');
    expect(elementFilter.props.fields.elementSelector.value).toBe('.foo');
    expect(advancedEventOptions.props.fields.bubbleStop.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      typeField,
      elementFilter,
      advancedEventOptions
    } = getReactComponents(instance);

    typeField.props.onChange('bar');
    elementFilter.props.fields.elementSelector.onChange('.foo');
    advancedEventOptions.props.fields.bubbleStop.onChange(true);

    const { type, elementSelector, bubbleStop } = extensionBridge.getSettings();

    expect(type).toBe('bar');
    expect(elementSelector).toBe('.foo');
    expect(bubbleStop).toBe(true);
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { typeWrapper, elementFilter } = getReactComponents(instance);

    expect(typeWrapper.props.error).toEqual(jasmine.any(String));
    expect(elementFilter.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });
});
