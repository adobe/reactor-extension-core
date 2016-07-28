import { mount } from 'enzyme';
import ScreenResolution from '../screenResolution';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ComparisonOperatorField from '../components/comparisonOperatorField';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

const getReactComponents = (wrapper) => {
  const widthOperatorField =
    wrapper.find(ComparisonOperatorField).filterWhere(n => n.prop('name') === 'widthOperator').node;
  const heightOperatorField = wrapper
    .find(ComparisonOperatorField).filterWhere(n => n.prop('name') === 'heightOperator').node;
  const widthField = wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'width').node;
  const heightField = wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'height').node;
  const widthWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'width').node;
  const heightWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'height').node;

  return {
    widthOperatorField,
    widthField,
    heightOperatorField,
    heightField,
    widthWrapper,
    heightWrapper
  };
};

describe('screen resolution view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(ScreenResolution, extensionBridge));
  });

  it('sets operators to greater than by default', () => {
    extensionBridge.init();

    const { widthOperatorField, heightOperatorField } = getReactComponents(instance);

    expect(widthOperatorField.props.value).toBe('>');
    expect(heightOperatorField.props.value).toBe('>');
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        widthOperator: '=',
        width: 100,
        heightOperator: '<',
        height: 200
      }
    });

    const {
      widthOperatorField,
      widthField,
      heightOperatorField,
      heightField
    } = getReactComponents(instance);

    expect(widthOperatorField.props.value).toBe('=');
    expect(widthField.props.value).toBe(100);
    expect(heightOperatorField.props.value).toBe('<');
    expect(heightField.props.value).toBe(200);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      widthOperatorField,
      widthField,
      heightOperatorField,
      heightField
    } = getReactComponents(instance);

    widthOperatorField.props.onChange('=');
    widthField.props.onChange(100);
    heightOperatorField.props.onChange('<');
    heightField.props.onChange(200);

    expect(extensionBridge.getSettings()).toEqual({
      widthOperator: '=',
      width: 100,
      heightOperator: '<',
      height: 200
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { widthWrapper, heightWrapper } = getReactComponents(instance);

    expect(widthWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets errors if values are not numbers', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { widthField, widthWrapper, heightField, heightWrapper } = getReactComponents(instance);

    widthField.props.onChange('12.abc');
    heightField.props.onChange('12.abc');

    expect(widthWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightWrapper.props.error).toEqual(jasmine.any(String));
  });
});
