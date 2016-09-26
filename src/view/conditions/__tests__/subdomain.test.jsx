import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

import Subdomain from '../subdomain';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import RegexToggle from '../../components/regexToggle';
import MultipleItemEditor from '../components/multipleItemEditor';

const getReactComponents = (wrapper) => {
  const subdomainFields = wrapper.find(Textfield).nodes;
  const subdomainRegexToggles = wrapper.find(RegexToggle).nodes;
  const subdomainWrappers = wrapper.find(ValidationWrapper).nodes;
  const multipleItemEditor = wrapper.find(MultipleItemEditor).node;

  return {
    subdomainFields,
    subdomainRegexToggles,
    subdomainWrappers,
    multipleItemEditor
  };
};

const testProps = {
  settings: {
    subdomains: [
      {
        value: 'foo'
      },
      {
        value: 'bar',
        valueIsRegex: true
      }
    ]
  }
};

describe('subdomain view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Subdomain, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const {
      subdomainFields,
      subdomainRegexToggles
    } = getReactComponents(instance);

    expect(subdomainFields[0].props.value).toBe('foo');
    expect(subdomainFields[1].props.value).toBe('bar');
    expect(subdomainRegexToggles[0].props.subdomains[0].valueIsRegex.input.value).toBe('');
    expect(subdomainRegexToggles[1].props.subdomains[1].valueIsRegex.input.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      subdomainFields,
      subdomainRegexToggles
    } = getReactComponents(instance);

    subdomainFields[0].props.onChange('goo');
    subdomainRegexToggles[0].props.subdomains[0].valueIsRegex.input.onChange(true);


    expect(extensionBridge.getSettings()).toEqual({
      subdomains: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { subdomainWrappers } = getReactComponents(instance);

    expect(subdomainWrappers[0].props.error).toEqual(jasmine.any(String));
  });
});
