import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setupComponent from '../../__tests__/helpers/setupComponent';
import DOM, { reducers } from '../dom';
import ValidationWrapper from '../../components/validationWrapper';

const {instance, extensionBridge} = setupComponent(DOM, reducers);
const getParts = () => {
  let textfields = TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield);
  let validationWrappers = TestUtils.scryRenderedComponentsWithType(instance, ValidationWrapper);
  return {
    elementSelectorField: textfields[0],
    elementSelectorValidationWrapper: validationWrappers[0],
    elementPropertyPresetSelect: TestUtils.findRenderedComponentWithType(instance, Coral.Select),
    customElementPropertyField: textfields.length > 1 ? textfields[1] : null,
    customElementPropertyValidationWrapper: validationWrappers.length > 1 ?
      validationWrappers[1] : null
  };
};

describe('DOM view', () => {
  it('selects ID preset for new config', () => {
    extensionBridge.init();

    const { elementPropertyPresetSelect } = getParts();

    expect(elementPropertyPresetSelect.props.value).toBe('id');
  });


  it('sets form values from config using element property preset', () => {
    extensionBridge.init({
      config: {
        elementSelector: 'foo',
        elementProperty: 'innerHTML'
      }
    });

    const { elementSelectorField, elementPropertyPresetSelect} = getParts();

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetSelect.props.value).toBe('innerHTML');
  });

  it('sets form values from config using custom element property', () => {
    extensionBridge.init({
      config: {
        elementSelector: 'foo',
        elementProperty: 'bar'
      }
    });

    const {
      elementSelectorField,
      elementPropertyPresetSelect,
      customElementPropertyField
    } = getParts();

    expect(elementSelectorField.props.value).toBe('foo');
    expect(elementPropertyPresetSelect.props.value).toBe('custom');
    expect(customElementPropertyField.props.value).toBe('bar');
  });

  it('sets error if element selector not provided', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { elementSelectorValidationWrapper } = getParts();

    expect(elementSelectorValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets config from form values using element property preset', () => {
    extensionBridge.init();

    const { elementSelectorField, elementPropertyPresetSelect } = getParts();

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetSelect.props.onChange('innerHTML');

    expect(extensionBridge.getConfig()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'innerHTML'
    });
  });

  it('sets config from form values using custom element property', () => {
    extensionBridge.init();

    const {
      elementSelectorField,
      elementPropertyPresetSelect
    } = getParts();

    elementSelectorField.props.onChange('foo');
    elementPropertyPresetSelect.props.onChange('custom');

    const {
      customElementPropertyField
    } = getParts();

    customElementPropertyField.props.onChange('bar');

    expect(extensionBridge.getConfig()).toEqual({
      elementSelector: 'foo',
      elementProperty: 'bar'
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init({
      config: {
        elementSelector: 'foo',
        elementProperty: ''
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { customElementPropertyValidationWrapper } = getParts();

    expect(customElementPropertyValidationWrapper.props.error).toEqual(jasmine.any(String));
  });
});
