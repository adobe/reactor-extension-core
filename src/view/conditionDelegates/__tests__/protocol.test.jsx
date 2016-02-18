import TestUtils from 'react-addons-test-utils';

import Protocol from '../protocol';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';

const { instance, extensionBridge } = setUpConnectedForm(Protocol);

describe('protocol view', () => {
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
