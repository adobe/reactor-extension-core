import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpComponent from '../../__tests__/helpers/setUpComponent';
import Domain, { reducers } from '../domain';
import CheckboxList from '../../components/checkboxList';

const { instance, extensionBridge } = setUpComponent(Domain, reducers);
const getParts = () => {
  return {
    checkboxList: TestUtils.findRenderedComponentWithType(instance, CheckboxList)
  };
};

const domains = [
  'adobe.com',
  'example.com'
];

const selectedDomains = [
  'adobe.com'
];

describe('domain view', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        domains: selectedDomains
      },
      propertyConfig: {
        domainList: domains
      }
    });

    const { checkboxList } = getParts();

    expect(checkboxList.props.options).toEqual(domains);
    expect(checkboxList.props.value).toEqual(selectedDomains);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { checkboxList } = getParts();
    checkboxList.props.onChange(selectedDomains);

    expect(extensionBridge.getConfig()).toEqual({
      domains: selectedDomains
    });
  });

  it('sets domains to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getConfig()).toEqual({
      domains: []
    });
  });
});
