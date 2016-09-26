import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';

import Path from '../path';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import RegexToggle from '../../components/regexToggle';
import MultipleItemEditor from '../components/multipleItemEditor';

const getReactComponents = (wrapper) => {
  const pathFields = wrapper.find(Textfield).nodes;
  const pathRegexToggles = wrapper.find(RegexToggle).nodes;
  const pathWrappers = wrapper.find(ValidationWrapper).nodes;
  const multipleItemEditor = wrapper.find(MultipleItemEditor).node;

  return {
    pathFields,
    pathRegexToggles,
    pathWrappers,
    multipleItemEditor
  };
};

const testProps = {
  settings: {
    paths: [
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

describe('path view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Path, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const {
      pathFields,
      pathRegexToggles
    } = getReactComponents(instance);

    expect(pathFields[0].props.value).toBe('foo');
    expect(pathFields[1].props.value).toBe('bar');
    expect(pathRegexToggles[0].props.paths[0].valueIsRegex.input.value).toBe('');
    expect(pathRegexToggles[1].props.paths[1].valueIsRegex.input.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pathFields, pathRegexToggles } = getReactComponents(instance);

    pathFields[0].props.onChange('goo');
    pathRegexToggles[0].props.paths[0].valueIsRegex.input.onChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      paths: [
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

    const { pathWrappers } = getReactComponents(instance);

    expect(pathWrappers[0].props.error).toEqual(jasmine.any(String));
  });
});
