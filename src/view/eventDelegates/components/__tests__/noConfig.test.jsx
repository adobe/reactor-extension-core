import setUpConnectedForm from '../../../__tests__/helpers/setUpConnectedForm';
import NoConfig from '../noConfig';

const { extensionBridge } = setUpConnectedForm(NoConfig);

describe('dom ready view', () => {
  it('sets settings from form values', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({});
  });

  it('is valid', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(true);
  });
});
