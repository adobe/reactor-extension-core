import TestUtils from 'react-addons-test-utils';

import OperatingSystem from '../operatingSystem';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(OperatingSystem);

const selectedOperatingSystems = [
  'Windows',
  'Unix'
];

describe('operating system view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        operatingSystems: selectedOperatingSystems
      }
    });

    const { operatingSystemsCheckboxList } = instance.refs;

    expect(operatingSystemsCheckboxList.props.value).toEqual(selectedOperatingSystems);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { operatingSystemsCheckboxList } = instance.refs;
    operatingSystemsCheckboxList.props.onChange(selectedOperatingSystems);

    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: selectedOperatingSystems
    });
  });

  it('sets operatingSystems to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      operatingSystems: []
    });
  });
});
