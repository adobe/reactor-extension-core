import { mount } from 'enzyme';
import Protocol from '../protocol';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';
import Radio from '@coralui/react-coral/lib/Radio';

const getReactComponents = (wrapper) => {
  const httpRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'http:').node;
  const httpsRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'https:').node;

  return {
    httpRadio,
    httpsRadio
  };
};

describe('protocol view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Protocol, extensionBridge));
  });

  it('sets http radio as checked by default', () => {
    extensionBridge.init();

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(true);
    expect(httpsRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        protocol: 'https:'
      }
    });

    const { httpRadio, httpsRadio } = getReactComponents(instance);

    expect(httpRadio.props.checked).toBe(false);
    expect(httpsRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { httpsRadio } = getReactComponents(instance);

    httpsRadio.props.onChange('https:');

    expect(extensionBridge.getSettings()).toEqual({
      protocol: 'https:'
    });
  });
});
