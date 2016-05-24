import WindowSize from '../windowSize';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('window size view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(WindowSize, extensionBridge);
  });

  it('sets operators to greater than by default', () => {
    extensionBridge.init();

    const { widthOperatorField, heightOperatorField } = instance.refs;

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

    const { widthOperatorField, widthField, heightOperatorField, heightField } = instance.refs;

    expect(widthOperatorField.props.value).toBe('=');
    expect(widthField.props.value).toBe(100);
    expect(heightOperatorField.props.value).toBe('<');
    expect(heightField.props.value).toBe(200);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { widthOperatorField, widthField, heightOperatorField, heightField } = instance.refs;

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
    } = instance.refs;

    expect(widthWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets errors if values are not numbers', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { widthField, widthWrapper, heightField, heightWrapper } = instance.refs;

    widthField.props.onChange('12.abc');
    heightField.props.onChange('12.abc');

    expect(widthWrapper.props.error).toEqual(jasmine.any(String));
    expect(heightWrapper.props.error).toEqual(jasmine.any(String));
  });
});
