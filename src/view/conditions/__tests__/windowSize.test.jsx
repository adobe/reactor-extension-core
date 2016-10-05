import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import CoralField from '../../components/coralField';
import WindowSize from '../windowSize';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import ComparisonOperatorField from '../components/comparisonOperatorField';

const getReactComponents = (wrapper) => {
  const comparisonOperatorFields = wrapper.find(ComparisonOperatorField);
  const textFields = wrapper.find(Textfield);
  const coralFields = wrapper.find(CoralField);

  const widthOperatorField = comparisonOperatorFields
    .filterWhere(n => n.prop('name') === 'widthOperator').node;
  const heightOperatorField = comparisonOperatorFields
    .filterWhere(n => n.prop('name') === 'heightOperator').node;
  const widthField = textFields.filterWhere(n => n.prop('name') === 'width').node;
  const heightField = textFields.filterWhere(n => n.prop('name') === 'height').node;
  const widthWrapper = coralFields.filterWhere(n => n.prop('name') === 'width')
    .find(ValidationWrapper).node;
  const heightWrapper = coralFields.filterWhere(n => n.prop('name') === 'height')
    .find(ValidationWrapper).node;

  return {
    widthOperatorField,
    widthField,
    heightOperatorField,
    heightField,
    widthWrapper,
    heightWrapper
  };
};

describe('window size view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(WindowSize, extensionBridge));
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

    const {
      widthWrapper,
      heightWrapper
    } = getReactComponents(instance);

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
