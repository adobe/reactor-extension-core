import extensionViewReduxForm from '../../../extensionViewReduxForm';
import { mount } from 'enzyme';
import ElementFilter, { formConfig } from '../elementFilter';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import Radio from '@coralui/react-coral/lib/Radio';
import SpecificElements from '../specificElements';

const getReactComponents = (wrapper) => {
  const specificElementsRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'specific').node;
  const anyElementRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'any').node;
  const specificElements = wrapper.find(SpecificElements).node;

  return {
    specificElementsRadio,
    specificElements,
    anyElementRadio
  };
};

describe('elementFilter', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ElementFilter);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('updates view properly when elementSelector is provided', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo'
      }
    });

    const { specificElementsRadio, specificElements } = getReactComponents(instance);

    expect(specificElementsRadio.props.checked).toBe(true);
    expect(specificElements).toBeDefined();
  });

  it('updates view properly when elementSelector is not provided', () => {
    extensionBridge.init({ settings: {} });

    const { anyElementRadio, specificElements } = getReactComponents(instance);

    expect(anyElementRadio.props.checked).toBe(true);
    expect(specificElements).not.toBeDefined();
  });

  it('removes elementSelector and elementProperties from settings if any ' +
    'element radio is selected', () => {
    extensionBridge.init({
      settings: {
        elementSelector: '.foo',
        elementProperties: [
          {
            name: 'a',
            value: 'b'
          }
        ]
      }
    });

    const { anyElementRadio } = getReactComponents(instance);

    anyElementRadio.props.onChange(anyElementRadio.props.value);

    const { elementSelector, elementProperties } = extensionBridge.getSettings();

    expect(elementSelector).toBeUndefined();
    expect(elementProperties).toBeUndefined();
  });

  it('includes specificElements errors if specific element radio is selected', () => {
    extensionBridge.init();

    const { specificElementsRadio } = getReactComponents(instance);

    specificElementsRadio.props.onChange(specificElementsRadio.props.value);

    expect(extensionBridge.validate()).toBe(false);

    const { specificElements } = getReactComponents(instance);

    expect(specificElements.props.fields.elementSelector.error).toEqual(jasmine.any(String));
  });

  it('excludes specificElements errors if any element radio is selected', () => {
    extensionBridge.init();

    const { anyElementRadio } = getReactComponents(instance);

    anyElementRadio.props.onChange(anyElementRadio.props.value);

    expect(extensionBridge.validate()).toBe(true);
  });
});
