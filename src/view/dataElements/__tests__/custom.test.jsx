import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import { ErrorTip } from '@reactor/react-components';

import Custom from '../custom';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;

  return {
    openEditorButton,
    sourceErrorIcon
  };
};

describe('custom view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(Custom, extensionBridge));
  });

  it('sets errors if required values are not provided', () => {
    extensionBridge.init();

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = getReactComponents(instance);

    expect(sourceErrorIcon.props.children).toEqual(jasmine.any(String));
  });
});
