import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';
import CodeField from '../codeField';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import extensionViewReduxForm from '../../extensionViewReduxForm';

const getReactComponents = (wrapper) => {
  const buttonWrapper = wrapper.find(Button);
  const errorTip = wrapper.find(ErrorTip);

  return {
    buttonWrapper,
    errorTip
  };
};

describe('code field button', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm({
      settingsToFormValues: (values, settings) => ({
        ...values,
        ...settings
      }),
      formValuesToSettings: (settings, values) => ({
        ...settings,
        ...values
      }),
      validate: (errors) => {
        errors = {
          ...errors
        };

        errors.field = 'Error';

        return errors;
      }
    })(CodeField);

    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge, {
      name: 'field'
    }));
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        field: 'value'
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((source, callback) => {
        callback('bar');
      })
    };

    const { buttonWrapper } = getReactComponents(instance);
    buttonWrapper.simulate('click');

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('value', jasmine.any(Function));
    expect(extensionBridge.getSettings()).toEqual({
      field: 'bar'
    });
  });

  it('shows an error when validate method fails', () => {
    extensionBridge.init();

    let { errorTip } = getReactComponents(instance);
    expect(errorTip.length).toBe(0);

    expect(extensionBridge.validate()).toBe(false);
    ({ errorTip } = getReactComponents(instance));
    expect(errorTip.length).toBe(1);
  });
});
