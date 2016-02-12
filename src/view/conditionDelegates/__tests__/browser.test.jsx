import TestUtils from 'react-addons-test-utils';

import Browser from '../browser';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Browser);

const selectedBrowsers = [
  'Chrome',
  'Safari'
];

describe('browser view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        browsers: selectedBrowsers
      }
    });

    const { browsersCheckboxList } = instance.refs;

    expect(browsersCheckboxList.props.value).toEqual(selectedBrowsers);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { browsersCheckboxList } = instance.refs;
    browsersCheckboxList.props.onChange(selectedBrowsers);

    expect(extensionBridge.getConfig()).toEqual({
      browsers: selectedBrowsers
    });
  });

  it('sets browsers to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getConfig()).toEqual({
      browsers: []
    });
  });
});
