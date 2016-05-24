import Protocol from '../protocol';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('protocol view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Protocol, extensionBridge);
  });

  it('sets http radio as checked by default', () => {
    extensionBridge.init();

    const { httpRadio, httpsRadio } = instance.refs;

    expect(httpRadio.props.checked).toBe(true);
    expect(httpsRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        protocol: 'https:'
      }
    });

    const { httpRadio, httpsRadio } = instance.refs;

    expect(httpRadio.props.checked).toBe(false);
    expect(httpsRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { httpsRadio } = instance.refs;

    httpsRadio.props.onChange('https:');

    expect(extensionBridge.getSettings()).toEqual({
      protocol: 'https:'
    });
  });
});
