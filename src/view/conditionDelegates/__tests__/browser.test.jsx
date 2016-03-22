import Browser from '../browser';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const selectedBrowsers = [
  'Chrome',
  'Safari'
];

describe('browser view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Browser, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        browsers: selectedBrowsers
      }
    });

    const { browsersCheckboxList } = instance.refs;

    expect(browsersCheckboxList.props.value).toEqual(selectedBrowsers);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { browsersCheckboxList } = instance.refs;
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
