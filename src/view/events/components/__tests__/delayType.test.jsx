import extensionViewReduxForm from '../../../extensionViewReduxForm';
import DelayType, { formConfig } from '../delayType';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('delayType', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(DelayType);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  describe('sets form values', () => {
    it('when settings contains delay value', () => {
      extensionBridge.init({
        settings: {
          delay: 500
        }
      });

      const { delayRadio, delayTextfield } = instance.refs;

      expect(delayRadio.props.checked).toBe(true);
      expect(delayTextfield.props.value).toBe(500);
    });

    it('when settings doesn\'t contain delay value', () => {
      extensionBridge.init({settings: {}});

      const { immediateRadio } = instance.refs;

      expect(immediateRadio.props.checked).toBe(true);
    });
  });

  it('has the specific element radio button selected', () => {
    extensionBridge.init();

    const { immediateRadio } = instance.refs;

    expect(immediateRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { delayRadio, delayTextfield } = instance.refs;

    delayRadio.props.onChange('delay');
    delayTextfield.props.onChange(100);

    expect(extensionBridge.getSettings()).toEqual({
      delay: 100
    });
  });

  it('sets settings without delay when trigger immediately is selected and delay ' +
    'contains a value', () => {
    extensionBridge.init();

    const { delayTextfield, immediateRadio } = instance.refs;

    delayTextfield.props.onChange(100);
    immediateRadio.props.onChange('immediately');

    expect(extensionBridge.getSettings().delay).toBeUndefined();
  });

  it('sets error if delay radio is selected and the delay field is empty', () => {
    extensionBridge.init();

    const { delayRadio, delayValidationWrapper } = instance.refs;
    delayRadio.props.onChange('delay');

    expect(extensionBridge.validate()).toBe(false);
    expect(delayValidationWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if the delay field is not a number', () => {
    extensionBridge.init();

    const { delayRadio, delayTextfield, delayValidationWrapper } = instance.refs;
    delayRadio.props.onChange('delay');
    delayTextfield.props.onChange('aaa');

    expect(extensionBridge.validate()).toBe(false);
    expect(delayValidationWrapper.props.error)
      .toEqual(jasmine.any(String));
  });
});
