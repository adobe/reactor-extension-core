import { mount } from 'enzyme';

import Domain from '../domain';
import CheckboxList from '../../components/checkboxList';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const domainsCheckboxList = wrapper.find(CheckboxList).node;

  return {
    domainsCheckboxList
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
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Domain, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        domains: selectedDomains
      },
      propertySettings: {
        domainList: domains
      }
    });

    const { domainsCheckboxList } = getReactComponents(instance);

    expect(domainsCheckboxList.props.options).toEqual(domains);
    expect(domainsCheckboxList.props.value).toEqual(selectedDomains);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { domainsCheckboxList } = getReactComponents(instance);
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
