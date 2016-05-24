import NoConfig from '../noConfig';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('dom ready view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(NoConfig, extensionBridge);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({});
  });

  it('is valid', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(true);
  });
});
