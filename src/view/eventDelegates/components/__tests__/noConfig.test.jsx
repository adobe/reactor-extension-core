import setUpConnectedForm from '../../../__tests__/helpers/setUpConnectedForm';
import NoConfig from '../noConfig';

const { extensionBridge } = setUpConnectedForm(NoConfig);

describe('dom ready view', () => {
  it('sets config from form values', () => {
    extensionBridge.init();
    expect(extensionBridge.getConfig()).toEqual({});
  });

  it('is valid', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(true);
  });
});
