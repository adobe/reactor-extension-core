import Path from '../path';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const testProps = {
  settings: {
    paths: [
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

describe('path view', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(Path, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init(testProps);

    const {
      pathField0,
      pathField1,
      pathRegexToggle0,
      pathRegexToggle1
    } = instance.refs.multipleItemEditor.refs;

    expect(pathField0.props.value).toBe('foo');
    expect(pathField1.props.value).toBe('bar');
    expect(pathRegexToggle0.props.valueIsRegex).toBe('');
    expect(pathRegexToggle1.props.valueIsRegex).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { pathField0, pathRegexToggle0 } = instance.refs.multipleItemEditor.refs;

    pathField0.props.onChange('goo');
    pathRegexToggle0.props.onValueIsRegexChange(true);

    expect(extensionBridge.getSettings()).toEqual({
      paths: [
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
      pathField0,
      pathField1,
      pathField2,
      pathField3
    } = instance.refs.multipleItemEditor.refs;

    expect(pathField0).toBeDefined();
    expect(pathField1).toBeDefined();
    expect(pathField2).toBeDefined();
    expect(pathField3).toBeUndefined();
  });

  it('removes a row', () => {
    extensionBridge.init(testProps);

    const { multipleItemEditor } = instance.refs;

    multipleItemEditor.props.onRemoveItem(1);

    const {
      pathField0,
      pathField1
    } = instance.refs.multipleItemEditor.refs;

    expect(pathField0).toBeDefined();
    expect(pathField1).toBeUndefined();
  });
  
  it('sets errors if required values are not provided', () => {
    extensionBridge.init();
    expect(extensionBridge.validate()).toBe(false);

    const { pathWrapper0 } = instance.refs.multipleItemEditor.refs;

    expect(pathWrapper0.props.error).toBeDefined();
  });
});
