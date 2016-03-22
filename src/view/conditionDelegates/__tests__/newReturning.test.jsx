import NewReturning from '../newReturning';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('new/returning visitor view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(NewReturning, extensionBridge);
  });

  it('sets new visitor radio as checked by default', () => {
    extensionBridge.init();

    const { newVisitorRadio, returningVisitorRadio } = instance.refs;

    expect(newVisitorRadio.props.checked).toBe(true);
    expect(returningVisitorRadio.props.checked).toBe(false);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        isNewVisitor: false
      }
    });

    const { newVisitorRadio, returningVisitorRadio } = instance.refs;

    expect(newVisitorRadio.props.checked).toBe(false);
    expect(returningVisitorRadio.props.checked).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { returningVisitorRadio } = instance.refs;

    returningVisitorRadio.props.onChange('returning');

    expect(extensionBridge.getSettings()).toEqual({
      isNewVisitor: false
    });
  });
});
