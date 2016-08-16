import { mount } from 'enzyme';

import Browser from '../browser';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import CheckboxList from '../../components/checkboxList';

const selectedBrowsers = [
  'Chrome',
  'Safari'
];

const getReactComponents = (wrapper) => {
  const browsersCheckboxList = wrapper.find(CheckboxList).node;

  return {
    browsersCheckboxList
  };
};

describe('browser view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Browser, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        browsers: selectedBrowsers
      }
    });

    const { browsersCheckboxList } = getReactComponents(instance);

    expect(browsersCheckboxList.props.value).toEqual(selectedBrowsers);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { browsersCheckboxList } = getReactComponents(instance);
    browsersCheckboxList.props.onChange(selectedBrowsers);

    expect(extensionBridge.getSettings()).toEqual({
      browsers: selectedBrowsers
    });
  });

  it('sets browsers to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      browsers: []
    });
  });
});
