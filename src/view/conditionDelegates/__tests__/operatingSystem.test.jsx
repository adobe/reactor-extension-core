import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import OperatingSystem from '../operatingSystem';
import CheckboxList from '../../components/checkboxList';

const { instance, extensionBridge } = setUpConnectedForm(OperatingSystem);
const getParts = () => {
  return {
    checkboxList: TestUtils.findRenderedComponentWithType(instance, CheckboxList)
  };
};

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

    const { checkboxList } = getParts();

    expect(checkboxList.props.value).toEqual(selectedOperatingSystems);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { checkboxList } = getParts();
    checkboxList.props.onChange(selectedOperatingSystems);

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
