import setUpComponent from '../../../__tests__/helpers/setUpComponent';
import NoConfig from '../noConfig';

const { extensionBridge } = setUpComponent(NoConfig);

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
