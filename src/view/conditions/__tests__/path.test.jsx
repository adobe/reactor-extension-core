import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';

import Path from '../path';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map(row => ({
    pathTextfield: row.find(Textfield).node,
    pathWrapper: row.find(ValidationWrapper).node,
    pathRegexSwitch: row.find(Switch).node
  }));

  return {
    rows
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

    const { rows } = getReactComponents(instance);

    expect(rows[0].pathTextfield.props.value).toBe('foo');
    expect(rows[1].pathTextfield.props.value).toBe('bar');
    expect(rows[0].pathRegexSwitch.props.checked).toBe(false);
    expect(rows[1].pathRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].pathTextfield.props.onChange('goo');
    rows[0].pathRegexSwitch.props.onChange({ target: { checked: true } });

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

    const { rows } = getReactComponents(instance);

    expect(rows[0].pathWrapper.props.error).toEqual(jasmine.any(String));
  });
});
