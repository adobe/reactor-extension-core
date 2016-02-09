import TestUtils from 'react-addons-test-utils';
import Coral from '../../reduxFormCoralUI';
import setUpConnectedForm from '../../__tests__/helpers/setUpConnectedForm';
import Protocol from '../protocol';

const { instance, extensionBridge } = setUpConnectedForm(Protocol);
const getParts = () => {
  const radios = TestUtils.scryRenderedComponentsWithType(instance, Coral.Radio);
  return {
    httpRadio: radios[0],
    httpsRadio: radios[1]
  };
};

describe('protocol view', () => {
  it('sets http radio as checked by default', () => {
    extensionBridge.init();

    const { httpRadio, httpsRadio } = getParts();

    expect(httpRadio.props.checked).toBe(true);
    expect(httpsRadio.props.checked).toBe(false);
  });

  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        protocol: 'https:'
      }
    });

    const { httpRadio, httpsRadio } = getParts();

    expect(httpRadio.props.checked).toBe(false);
    expect(httpsRadio.props.checked).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { httpsRadio } = getParts();

    httpsRadio.props.onChange('https:');

    expect(extensionBridge.getConfig()).toEqual({
      protocol: 'https:'
    });
  });
});
