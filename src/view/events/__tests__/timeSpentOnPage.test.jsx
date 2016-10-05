import { mount } from 'enzyme';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';
import TimeSpentOnPage from '../timeSpentOnPage';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const timeOnPageField = wrapper.find(Textfield).node;
  const timeOnPageWrapper = wrapper.find(ValidationWrapper).node;

  return {
    timeOnPageField,
    timeOnPageWrapper
  };
};

describe('time spent on page view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(TimeSpentOnPage, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        timeOnPage: 44
      }
    });

    const { timeOnPageField } = getReactComponents(instance);

    expect(timeOnPageField.props.value).toBe(44);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { timeOnPageField } = getReactComponents(instance);
    timeOnPageField.props.onChange('55');

    expect(extensionBridge.getSettings()).toEqual({
      timeOnPage: 55
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageWrapper } = getReactComponents(instance);

    expect(timeOnPageWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if timeOnPage value is not a number', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { timeOnPageField, timeOnPageWrapper } = getReactComponents(instance);

    timeOnPageField.props.onChange('12.abc');

    expect(timeOnPageWrapper.props.error).toEqual(jasmine.any(String));
  });
});
