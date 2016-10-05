import { mount } from 'enzyme';
import { Textfield } from '@coralui/react-coral';
import { DataElementSelectorButton } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import CoralField from '../coralField';

const getReactComponents = (wrapper) => {
  const dataElementButton = wrapper.find(DataElementSelectorButton).node;
  const cssElementButton = wrapper.find(Button)
    .filterWhere(n => n.prop('icon') === 'target').node;
  const textfield = wrapper.find(Textfield).node;
  const suffixLabel = wrapper.find('span.Label');

  return {
    dataElementButton,
    cssElementButton,
    textfield,
    suffixLabel
  };
};

describe('field', () => {
  it('opens the data element selector from data element button', () => {
    const FormComponent = extensionViewReduxForm({
      settingsToFormValues: () => {}
    })(CoralField);
    const extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;

    const instance = mount(
      getFormComponent(FormComponent, extensionBridge, {
        name: 'field',
        supportDataElement: true,
        component: Textfield
      })
    );

    extensionBridge.init();

    const {
      dataElementButton,
      textfield
    } = getReactComponents(instance);

    extensionBridge.openDataElementSelector = jasmine.createSpy('openDataElementSelector')
      .and.callFake(callback => {
        callback('foo');
      });

    dataElementButton.props.onClick();

    expect(extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(textfield.props.value).toBe('%foo%');

    delete window.extensionBridge;
  });

  it('opens the css element selector from data element button', () => {
    const FormComponent = extensionViewReduxForm({
      settingsToFormValues: () => {}
    })(CoralField);
    const extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;

    const instance = mount(
      getFormComponent(FormComponent, extensionBridge, {
        name: 'field',
        supportCssSelector: true,
        component: Textfield
      })
    );

    extensionBridge.init();

    const {
      cssElementButton,
      textfield
    } = getReactComponents(instance);

    extensionBridge.openCssSelector = jasmine.createSpy('openDataElementSelector')
      .and.callFake(callback => {
        callback('foo');
      });

    cssElementButton.props.onClick();

    expect(extensionBridge.openCssSelector).toHaveBeenCalled();
    expect(textfield.props.value).toBe('foo');

    delete window.extensionBridge;
  });


  it('adds a suffix label', () => {
    const FormComponent = extensionViewReduxForm({
      settingsToFormValues: () => {}
    })(CoralField);

    const extensionBridge = createExtensionBridge();
    const instance = mount(
      getFormComponent(FormComponent, extensionBridge, {
        name: 'field',
        suffixLabel: 'suf',
        component: Textfield
      })
    );

    extensionBridge.init();

    const {
      suffixLabel
    } = getReactComponents(instance);

    expect(suffixLabel.text()).toBe('suf');
  });
});
