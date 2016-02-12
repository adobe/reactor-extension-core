import TestUtils from 'react-addons-test-utils';

import OperatingSystem from '../operatingSystem';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(OperatingSystem);

const selectedOperatingSystems = [
  'Windows',
  'Unix'
];

describe('operating system view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        operatingSystems: selectedOperatingSystems
      }
    });

    const { operatingSystemsCheckboxList } = instance.refs;

    expect(operatingSystemsCheckboxList.props.value).toEqual(selectedOperatingSystems);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { operatingSystemsCheckboxList } = instance.refs;
    operatingSystemsCheckboxList.props.onChange(selectedOperatingSystems);

    expect(extensionBridge.getConfig()).toEqual({
      operatingSystems: selectedOperatingSystems
    });
  });

  it('sets operatingSystems to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getConfig()).toEqual({
      operatingSystems: []
    });
  });
});
