import TestUtils from 'react-addons-test-utils';
import Coral from '../../../reduxFormCoralUI';
import setUpConnectedForm from '../../../__tests__/helpers/setUpConnectedForm';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import ElementPropertyEditor from '../elementPropertyEditor';
import ElementPropertiesEditor, { fields, reducers } from '../elementPropertiesEditor';


const FormComponent = extensionViewReduxForm({
  fields,
  validate: values => reducers.validate({}, values)
})(ElementPropertiesEditor);

const { instance, extensionBridge } = setUpConnectedForm(FormComponent, reducers);

const getParts = () => {
  const editorRows = TestUtils.scryRenderedComponentsWithType(instance, ElementPropertyEditor);
  return {
    addButton: instance.refs.addButton,
    editorRows,
    firstEditorRow: editorRows[0]
  };
};

describe('elementPropertiesEditor', () => {
  it('sets form values from config', () => {
    extensionBridge.init({
      config: {
        elementProperties:[
          {
            name: 'someprop',
            value: 'somevalue',
            valueIsRegex: true
          }
        ]
      }
    });

    const { firstEditorRow } = getParts(instance);
    expect(firstEditorRow.props.fields.name.value).toBe('someprop');
    expect(firstEditorRow.props.fields.value.value).toBe('somevalue');
    expect(firstEditorRow.props.fields.valueIsRegex.value).toBe(true);
  });

  it('sets config from form values', () => {
    extensionBridge.init();

    const { firstEditorRow } = getParts(instance);

    firstEditorRow.props.fields.name.onChange('somepropset');
    firstEditorRow.props.fields.value.onChange('somevalueset');
    firstEditorRow.props.fields.valueIsRegex.onChange(true);

    const { elementProperties } = extensionBridge.getConfig();
    expect(elementProperties).toEqual([
      {
        name: 'somepropset',
        value: 'somevalueset',
        valueIsRegex: true
      }
    ]);
  });

  it('sets error if element property name field is empty and value is not empty', () => {
    extensionBridge.init();

    const { firstEditorRow } = getParts(instance);

    firstEditorRow.props.fields.value.onChange('foo');

    expect(extensionBridge.validate()).toBe(false);

    expect(firstEditorRow.props.fields.name.touched).toBe(true);
    expect(firstEditorRow.props.fields.name.error).toEqual(jasmine.any(String));
  });

  it('creates a new row when the add button is clicked', () => {
    extensionBridge.init();

    const { addButton } = getParts(instance);
    addButton.props.onClick();

    const { editorRows } = getParts(instance);

    // First row is visible by default.
    expect(editorRows.length).toBe(2);
  });

  it('deletes a row when requested from row', () => {
    extensionBridge.init({
      config: {
        elementProperties:[
          {
            name: 'someprop',
            value: 'somevalue',
            valueIsRegex: true
          },
          {
            name: 'someprop2',
            value: 'somevalue2',
            valueIsRegex: true
          }
        ]
      }
    });

    const { firstEditorRow } = getParts(instance);

    firstEditorRow.props.remove();

    const { editorRows } = getParts(instance);

    expect(editorRows.length).toBe(1);
  });
});
