import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

import Hash from '../hash';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import RegexToggle from '../../components/regexToggle';
import MultipleItemEditor from '../components/multipleItemEditor';

const getReactComponents = (wrapper) => {
  const hashFields = wrapper.find(Textfield).nodes;
  const hashRegexToggles = wrapper.find(RegexToggle).nodes;
  const hashWrappers = wrapper.find(ValidationWrapper).nodes;
  const multipleItemEditor = wrapper.find(MultipleItemEditor).node;

  return {
    hashFields,
    hashRegexToggles,
    hashWrappers,
    multipleItemEditor
  };
};


const testProps = {
  settings: {
    hashes: [
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

describe('hash view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Hash, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const {
      hashFields,
      hashRegexToggles
    } = getReactComponents(instance);

    expect(hashFields[0].props.value).toBe('foo');
    expect(hashFields[1].props.value).toBe('bar');
    expect(hashRegexToggles[0].props.hashes[0].valueIsRegex.input.value).toBe('');
    expect(hashRegexToggles[1].props.hashes[1].valueIsRegex.input.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      hashFields,
      hashRegexToggles
    } = getReactComponents(instance);

    hashFields[0].props.onChange('goo');
    hashRegexToggles[0].props.hashes[0].valueIsRegex.input.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      hashes: [
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

    const { hashWrappers } = getReactComponents(instance);

    expect(hashWrappers[0].props.error).toEqual(jasmine.any(String));
  });
});
