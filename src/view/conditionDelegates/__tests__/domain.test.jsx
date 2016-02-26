import TestUtils from 'react-addons-test-utils';

import Domain from '../domain';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Domain);

const domains = [
  'adobe.com',
  'example.com'
];

const selectedDomains = [
  'adobe.com'
];

describe('domain view', () => {
  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        domains: selectedDomains
      },
      propertySettings: {
        domainList: domains
      }
    });

    const { domainsCheckboxList } = instance.refs;

    expect(domainsCheckboxList.props.options).toEqual(domains);
    expect(domainsCheckboxList.props.value).toEqual(selectedDomains);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { domainsCheckboxList } = instance.refs;
    domainsCheckboxList.props.onChange(selectedDomains);

    expect(extensionBridge.getSettings()).toEqual({
      domains: selectedDomains
    });
  });

  it('sets domains to an empty array if nothing is selected', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({
      domains: []
    });
  });
});
