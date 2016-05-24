import Hash from '../hash';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const testProps = {
  settings: {
    hashes: [
      {
        value: 'foo'
      },
      {
        value: 'bar',
        valueIsRegex: true
      }
    ]
  }
};

describe('hash view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Hash, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const {
      hashField0,
      hashField1,
      hashRegexToggle0,
      hashRegexToggle1
    } = instance.refs.multipleItemEditor.refs;

    expect(hashField0.props.value).toBe('foo');
    expect(hashField1.props.value).toBe('bar');
    expect(hashRegexToggle0.props.valueIsRegex).toBe('');
    expect(hashRegexToggle1.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { hashField0, hashRegexToggle0 } = instance.refs.multipleItemEditor.refs;

    hashField0.props.onChange('goo');
    hashRegexToggle0.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      hashes: [
        {
          value: 'goo',
          valueIsRegex: true
        }
      ]
    });
  });

  it('adds a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = instance.refs;

    multipleItemEditor.props.onAddItem();

    const {
      hashField0,
      hashField1,
      hashField2,
      hashField3
    } = instance.refs.multipleItemEditor.refs;

    expect(hashField0).toBeDefined();
    expect(hashField1).toBeDefined();
    expect(hashField2).toBeDefined();
    expect(hashField3).toBeUndefined();
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = instance.refs;

    multipleItemEditor.props.onRemoveItem(1);

    const {
      hashField0,
      hashField1
    } = instance.refs.multipleItemEditor.refs;

    expect(hashField0).toBeDefined();
    expect(hashField1).toBeUndefined();
  });
  
  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { hashWrapper0 } = instance.refs.multipleItemEditor.refs;

    expect(hashWrapper0.props.error).toBeDefined();
  });
});
