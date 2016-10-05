import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Switch from '@coralui/react-coral/lib/Switch';

import Hash from '../hash';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map(row => ({
    hashTextfield: row.find(Textfield).node,
    hashRegexSwitch: row.find(Switch).node,
    hashWrapper: row.find(ValidationWrapper).node
  }));

  return {
    rows
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

    const { rows } = getReactComponents(instance);

    expect(rows[0].hashTextfield.props.value).toBe('foo');
    expect(rows[1].hashTextfield.props.value).toBe('bar');
    expect(rows[0].hashRegexSwitch.props.checked).toBe(false);
    expect(rows[1].hashRegexSwitch.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].hashTextfield.props.onChange('goo');
    rows[0].hashRegexSwitch.props.onChange({ target: { checked: true } });

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

    const { rows } = getReactComponents(instance);

    expect(rows[0].hashWrapper.props.error).toEqual(jasmine.any(String));
  });
});
