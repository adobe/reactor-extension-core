import { mount } from 'enzyme';

import NoConfig from '../noConfig';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('dom ready view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(NoConfig, extensionBridge));
  });

  it('sets settings from form values', () => {
    extensionBridge.init();
    expect(extensionBridge.getSettings()).toEqual({});
    expect(instance).toBeDefined();
  });

  it('is valid', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(true);
    expect(instance).toBeDefined();
  });
});
